import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GrowthTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-text-secondary">{label} 2026</p>
      <p className="text-sm font-semibold text-primary">{payload[0].value} members</p>
    </div>
  );
}

export default function MemberGrowthChart({ data }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-secondary">Member Overview</h2>
        <p className="text-sm text-text-secondary">Member growth over the last 6 months</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="memberGrowthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0077C8" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#0077C8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <YAxis hide domain={[80, "dataMax + 10"]} />
            <Tooltip content={<GrowthTooltip />} cursor={{ stroke: "#E2E8F0" }} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#0077C8"
              strokeWidth={2}
              fill="url(#memberGrowthFill)"
              dot={{ r: 3, fill: "#0077C8", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 5, fill: "#0077C8", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
