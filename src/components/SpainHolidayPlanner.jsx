import { useEffect, useState } from 'react';

function SpainHolidayPlanner() {
  const [holidays, setHolidays] = useState([]);
  const [ptoDays, setPtoDays] = useState(0);

  useEffect(() => {
    (async () => {
      const year = new Date().getFullYear();
      const url = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=ES&languageIsoCode=ES&validFrom=${year}-01-01&validTo=${year}-12-31`;
      const res = await fetch(url);
      const data = await res.json();
      setHolidays(data);
    })();
  }, []);

  const suggestions = (() => {
    let remaining = Number(ptoDays);
    const out = [];
    const byDate = (holidays||[]).slice().sort((a,b)=> a.startDate.localeCompare(b.startDate));
    for (const h of byDate) {
      if (remaining <= 0) break;
      const date = new Date(h.startDate);
      const dow = date.getDay(); // 0 Sun ... 6 Sat
      // If holiday Tuesday (2) -> take Monday; Thursday (4) -> take Friday
      let ptoDate = null;
      if (dow === 2) { // Tuesday
        ptoDate = new Date(date); ptoDate.setDate(date.getDate() - 1);
      } else if (dow === 4) { // Thursday
        ptoDate = new Date(date); ptoDate.setDate(date.getDate() + 1);
      }
      if (ptoDate) {
        remaining -= 1;
        const weekendStart = new Date(ptoDate);
        // If taking Monday, weekend spans Sat->Tue; if taking Friday, Thu->Sun
        if (dow === 2) weekendStart.setDate(ptoDate.getDate() - 2); // Saturday before
        else if (dow === 4) weekendStart.setDate(date.getDate()); // Thursday
        const weekendEnd = new Date(weekendStart);
        weekendEnd.setDate(weekendStart.getDate() + (dow === 2 ? 3 : 3));
        out.push({
          holiday: h.startDate,
          holidayName: h.name?.[0]?.text || 'Holiday',
          pto: ptoDate.toISOString().slice(0,10),
          range: weekendStart.toISOString().slice(0,10) + ' → ' + weekendEnd.toISOString().slice(0,10)
        });
      }
    }
    return out;
  })();

  // Simple month grouping for a "calendar" feel
  const monthGroups = suggestions.reduce((acc, s) => {
    const m = s.holiday.slice(0,7); // YYYY-MM
    (acc[m] = acc[m] || []).push(s);
    return acc;
  }, {});

  return (
    <section className="card planner">
      <h2 className="card-title">Spain Holiday PTO Planner</h2>
      <div className="input-row">
        <label className="field">
          <span className="field-label">PTO days left</span>
          <input className="input" type="number" value={ptoDays} onChange={e=>setPtoDays(e.target.value)} min="0" />
        </label>
      </div>
      <div className="suggestions">
        {Object.keys(monthGroups).length === 0 && <div className="empty">No suggestions yet.</div>}
        {Object.entries(monthGroups).map(([month, list]) => (
          <div key={month} className="month-block">
            <h3 className="month-heading">{month}</h3>
            <ul className="list compact">
              {list.map(s => (
                <li key={s.holiday} className="list-item plan-item">
                  <span className="plan-name">{s.holidayName}</span>
                  <span className="plan-date">{s.holiday}</span>
                  <span className="plan-pto">Take {s.pto}</span>
                  <span className="plan-range">Weekend {s.range}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpainHolidayPlanner;
