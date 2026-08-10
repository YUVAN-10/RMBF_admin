import MemberAvatar from "../members/MemberAvatar";

export default function MemberMiniProfile({ name, ridNo, image, size = "sm", layout = "row" }) {
  const isColumn = layout === "column";

  return (
    <div className={["flex items-center gap-2.5", isColumn ? "flex-col text-center" : "min-w-0"].join(" ")}>
      <MemberAvatar name={name} image={image} size={size} />
      <div className={isColumn ? "" : "min-w-0"}>
        <p className={["truncate font-medium text-text", isColumn ? "text-base" : "text-sm"].join(" ")}>
          {name}
        </p>
        <p className="text-xs text-text-secondary">RID: {ridNo || "—"}</p>
      </div>
    </div>
  );
}
