import { motion } from 'framer-motion';

export default function NeonCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl border border-white/10 bg-cyber-panel/55 backdrop-blur-md shadow-neonCard ${className}`}
    >
      {children}
    </motion.div>
  );
}
