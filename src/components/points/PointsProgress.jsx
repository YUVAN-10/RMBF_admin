import { pointsPercent } from "../../utils/pointsMonth";

export default function PointsProgress({ points, maxPoints, size = "md" }) {
  const percent = pointsPercent(points, maxPoints);
  const barHeight = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full min-w-[120px]">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span className="tabular-nums">
          {points.toLocaleString()} / {maxPoints.toLocaleString()}
        </span>
        <span className="font-medium text-text">{percent}%</span>
      </div>
      <div className={`mt-1.5 ${barHeight} w-full overflow-hidden rounded-full bg-bg`}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
