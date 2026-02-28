export default function PeriodFilter({ options, value, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-cyber-pink/35 bg-cyber-charcoal/75 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-200">
      <span className="text-cyber-pink">Periode</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-cyber-cyan border-none outline-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-cyber-charcoal text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
