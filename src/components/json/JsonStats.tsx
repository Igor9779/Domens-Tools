type Props = {
  count: number;
  t: (k: any) => string;
};

export default function JsonStats({ count, t }: Props) {
  return (
    <div className="stats-bar">
      <div className="stat-pill">
        <span className="stat-label">{t("lines")}</span>
        <span className="stat-value">{count}</span>
      </div>
    </div>
  );
}
