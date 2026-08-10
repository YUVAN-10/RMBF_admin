import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from "recharts";

const BAR_COLORS = ["#0077C8", "#0F4C5C", "#F4B942"];

function ActivityTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-text-secondary">{item.payload.name}</p>
      <p className="text-sm font-semibold text-text">{item.value}</p>
    </div>
  );
}

export default function ActivityChart({ data }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-secondary">Activity Overview</h2>
        <p className="text-sm text-text-secondary">Meetings, R to R and Events this year</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} width={36} />
            <Tooltip content={<ActivityTooltip />} cursor={{ fill: "#F7F9FC" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
              <LabelList dataKey="value" position="top" fill="#172033" fontSize={12} fontWeight={600} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
