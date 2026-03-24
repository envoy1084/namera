export const SvgDefs = () => {
  return (
    <svg className="absolute" height="0" width="0">
      <title>SVG Definitions</title>
      <defs>
        <linearGradient id="gradient-primary">
          <stop offset="0" stopColor="#646E87" />
          <stop offset="1" stopColor="#9AA8CB" />
        </linearGradient>
      </defs>
    </svg>
  );
};
