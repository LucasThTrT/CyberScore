import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import LeaderboardBar from '../components/LeaderboardBar';
import NeonCard from '../components/NeonCard';
import VulnerabilityCard from '../components/VulnerabilityCard';
import { useVulnerabilities } from '../hooks/useVulnerabilities';
import { fadeUp, staggerContainer } from '../utils/animations';
import { formatRelativeMinutes } from '../utils/formatters';

export default function LeaderboardPage() {
  const {
    vulnerabilities,
    leaderboard,
    loading,
    refreshing,
    error,
    lastUpdated,
    newAwards,
    manualRefresh,
  } = useVulnerabilities();
  const [burstAward, setBurstAward] = useState(null);

  const maxScore = leaderboard[0]?.score || 1;

  useEffect(() => {
    if (!newAwards?.length) return;

    let isCancelled = false;
    let delay = 0;
    const timeoutIds = [];

    newAwards.forEach((award) => {
      const openTimeout = setTimeout(() => {
        if (isCancelled) return;
        setBurstAward(award);
        confetti({
          particleCount: 180,
          spread: 95,
          startVelocity: 55,
          origin: { y: 0.58 },
          ticks: 320,
          scalar: 1.05,
        });
      }, delay);

      const closeTimeout = setTimeout(() => {
        if (isCancelled) return;
        setBurstAward(null);
      }, delay + 1500);

      timeoutIds.push(openTimeout, closeTimeout);
      delay += 1700;
    });

    return () => {
      isCancelled = true;
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [newAwards]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6 h-full min-h-0 flex flex-col relative"
    >
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.18em] text-cyber-pink drop-shadow-[0_0_12px_rgba(255,43,191,0.7)]">
            Live Leaderboard
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Syncs with Notion every 30 minutes. Last update: {formatRelativeMinutes(lastUpdated)}
          </p>
        </div>

        <button
          onClick={manualRefresh}
          disabled={refreshing}
          className="rounded-md border border-cyber-cyan/50 bg-cyber-charcoal/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyber-cyan shadow-neonCyan hover:bg-cyber-charcoal disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : 'Manual Refresh'}
        </button>
      </motion.div>

      {error ? (
        <div className="rounded-lg border border-cyber-high/50 bg-cyber-high/10 px-4 py-3 text-cyber-high text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-cyber-panel/40 px-4 py-8 text-center text-slate-300">
          Loading vulnerabilities from Notion...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0">
          <NeonCard className="p-4 md:p-5 h-full min-h-0 flex flex-col" delay={0.05}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm md:text-base uppercase tracking-[0.2em] text-cyber-cyan">Pentester Ranking</h3>
              <span className="text-xs text-slate-400">{leaderboard.length} Pentesters</span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 min-h-0 flex-1">
              {leaderboard.map((entry) => (
                <LeaderboardBar
                  key={entry.pentester}
                  pentester={entry.pentester}
                  score={entry.score}
                  rank={entry.rank}
                  maxScore={maxScore}
                />
              ))}
            </div>
          </NeonCard>

          <NeonCard className="p-4 md:p-5 h-full min-h-0 flex flex-col" delay={0.1}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm md:text-base uppercase tracking-[0.2em] text-cyber-pink">Vulnerability Feed</h3>
              <span className="text-xs text-slate-400">{vulnerabilities.length} Events</span>
            </div>

            <motion.div layout className="space-y-3 overflow-y-auto pr-1 min-h-0 flex-1">
              <AnimatePresence>
                {vulnerabilities.map((vuln, idx) => (
                  <VulnerabilityCard
                    key={vuln.id}
                    vulnerability={vuln}
                    isFresh={idx < 3}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </NeonCard>
        </div>
      )}

      <AnimatePresence>
        {burstAward ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 grid place-items-center z-30"
          >
            <motion.div
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -22, opacity: 0 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-cyber-cyan/90 mb-2">New vulnerability found</p>
              <p className="text-6xl md:text-8xl font-black text-cyber-pink drop-shadow-[0_0_16px_rgba(255,43,191,0.95)]">
                +{burstAward.points}
              </p>
              <p className="text-sm md:text-base text-slate-200 mt-2">
                {burstAward.pentester} gained points
              </p>
              <p className="text-xs md:text-sm text-slate-300/90 mt-1 max-w-xl truncate">
                {burstAward.title}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
