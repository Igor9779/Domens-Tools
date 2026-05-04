import type { TranslationFn } from "../../hooks/useTranslation";

type Props = {
  count: number;
  t: TranslationFn;
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
