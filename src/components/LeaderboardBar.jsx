import { motion } from 'framer-motion';

export default function LeaderboardBar({ pentester, score, rank, maxScore }) {
  const width = Math.max(10, Math.round((score / Math.max(maxScore, 1)) * 100));
  const isTopRank = rank === 1;

  const content = (
    <>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full border border-cyber-cyan/50 grid place-items-center text-cyber-cyan text-[10px]">
            #{rank}
          </span>
          <span className="text-slate-200 font-semibold">{pentester}</span>
        </div>
        <span className="text-cyber-pink font-bold">{score} pts</span>
      </div>

      <div className="h-3 rounded-full bg-black/40 overflow-hidden border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-cyan animate-pulseSoft shadow-neonPink"
        />
      </div>
    </>
  );

  if (isTopRank) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="top-rank-card p-[1px]"
      >
        <div className="top-rank-surface p-3 shadow-[0_0_18px_rgba(0,245,255,0.16)]">
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="rounded-lg border border-cyan-200/10 bg-cyber-charcoal/80 p-3"
    >
      {content}
    </motion.div>
  );
}
