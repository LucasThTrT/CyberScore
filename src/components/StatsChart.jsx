import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatDate } from '../utils/formatters';

const palette = ['#00f5ff', '#ff2bbf', '#8a2bff', '#00f5b0', '#ff9d2b', '#55d1ff'];

export default function StatsChart({ data, pentesters }) {
  return (
    <div className="h-full min-h-[320px] w-full rounded-xl border border-white/10 bg-cyber-panel/60 p-4">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDate(value).slice(0, 12)}
            stroke="rgba(255,255,255,0.5)"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(6,7,13,0.9)',
              border: '1px solid rgba(0,245,255,0.3)',
              borderRadius: '8px',
            }}
            labelFormatter={(value) => formatDate(value)}
          />
          {pentesters.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={palette[index % palette.length]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive
              animationDuration={650}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
