import { motion } from 'framer-motion';
import NeonCard from '../components/NeonCard';
import StatsChart from '../components/StatsChart';
import { useVulnerabilities } from '../hooks/useVulnerabilities';
import { fadeUp } from '../utils/animations';

export default function StatsPage() {
  const { scoreTimeline, leaderboard, loading, error } = useVulnerabilities();
  const pentesters = leaderboard.map((entry) => entry.pentester);

  return (
    <div className="space-y-5 h-full min-h-0 flex flex-col">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.18em] text-cyber-cyan drop-shadow-[0_0_12px_rgba(0,245,255,0.7)]">
          Score Evolution
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Multi-line trend of cumulative pentester scores over time.
        </p>
      </motion.div>

      {error ? (
        <div className="rounded-lg border border-cyber-high/50 bg-cyber-high/10 px-4 py-3 text-cyber-high text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-cyber-panel/40 px-4 py-8 text-center text-slate-300">
          Loading score trends...
        </div>
      ) : (
        <NeonCard className="p-4 md:p-5 flex-1 min-h-0" delay={0.05}>
          <StatsChart data={scoreTimeline} pentesters={pentesters} />
        </NeonCard>
      )}
    </div>
  );
}
