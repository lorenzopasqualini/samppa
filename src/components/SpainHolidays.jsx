import { useEffect, useState } from 'react';

function SpainHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = new Date().getFullYear();
        const validFrom = `${year}-01-01`;
        const validTo = `${year}-12-31`;
        const url = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=ES&languageIsoCode=ES&validFrom=${validFrom}&validTo=${validTo}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setHolidays(data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  if (loading) return <div className="card subtle">Loading holidays…</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <section className="card holidays">
      <h2 className="card-title">Spain Public Holidays</h2>
      <ul className="list">
        {holidays.map(h => (
          <li key={h.id || h.startDate} className="list-item">
            <span className="holiday-name">{h.name?.[0]?.text || 'Unnamed'}</span>
            <span className="holiday-date">{h.startDate}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SpainHolidays;
