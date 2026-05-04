type Props = {
  lines: number;
  long: number;
  dup: number;
  t: (k: any) => string;
};

export default function StatsBar({ lines, long, dup, t }: Props) {
  return (
    <div className="stats-bar">
      <div className="stat-pill">
        <span className="stat-label">{t("lines")}</span>
        <span className="stat-value">{lines}</span>
      </div>

      <div className="stat-pill">
        <span className="stat-label">{t("tooLongStat")}</span>
        <span className="stat-value" style={{ color: "var(--accent2)" }}>
          {long}
        </span>
      </div>

      <div className="stat-pill">
        <span className="stat-label">{t("duplicates")}</span>
        <span className="stat-value" style={{ color: "var(--accent-dup)" }}>
          {dup}
        </span>
      </div>
    </div>
  );
}
