function getInitials(fullName = "") {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MemberAvatar({ name, image, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-20 w-20 text-xl",
  };

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={[sizes[size], "shrink-0 rounded-full object-cover"].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        sizes[size],
        "flex shrink-0 items-center justify-center rounded-full bg-primary-light font-semibold text-primary",
      ].join(" ")}
    >
      {getInitials(name)}
    </div>
  );
}
