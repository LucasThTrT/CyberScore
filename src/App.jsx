import { NavLink, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaderboardPage from './pages/LeaderboardPage';
import StatsPage from './pages/StatsPage';

const navClass = ({ isActive }) =>
  `px-4 py-2 rounded-md text-sm tracking-wider uppercase transition-all ${
    isActive
      ? 'text-cyber-cyan shadow-neonCyan bg-cyber-charcoal/70'
      : 'text-slate-300 hover:text-cyber-pink hover:bg-cyber-charcoal/40'
  }`;

export default function App() {
  return (
    <div className="h-screen text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_15%_20%,rgba(0,245,255,0.12),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(255,43,191,0.15),transparent_45%),linear-gradient(120deg,#06070d,#0b1020,#090d18)]" />
      <div className="pointer-events-none absolute inset-0 animate-gridDrift bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto h-full flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex items-center justify-between gap-3 shrink-0"
        >
          <h1 className="text-xl md:text-3xl font-black tracking-[0.3em] uppercase text-cyber-cyan drop-shadow-[0_0_12px_rgba(0,245,255,0.9)]">
            Escape hacker team
          </h1>
          <nav className="flex gap-2 bg-cyber-panel/40 border border-white/10 rounded-lg p-1 backdrop-blur-xs">
            <NavLink to="/" className={navClass} end>
              Leaderboard
            </NavLink>
            <NavLink to="/stats" className={navClass}>
              Score Evolution
            </NavLink>
          </nav>
        </motion.header>

        <main className="flex-1 min-h-0">
          <Routes>
            <Route path="/" element={<LeaderboardPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
