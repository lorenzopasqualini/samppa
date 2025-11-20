import './App.css';
import SpainHolidays from './components/SpainHolidays.jsx';
import SpainHolidayPlanner from './components/SpainHolidayPlanner.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <ThemeToggle />
      <header className="app-header">
        <h1 className="app-title">Holiday & PTO Planner</h1>
      </header>
      <main className="grid">
        <div className="grid-col">
          <SpainHolidayPlanner />
        </div>
        <div className="grid-col">
          <SpainHolidays />
        </div>
      </main>
      <footer className="app-footer">Plan smarter. Rest better.</footer>
    </div>
  );
}
