import type { TranslationFn } from "../../hooks/useTranslation";

type Props = {
  taskName?: string;
  t: TranslationFn;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function NotepadConfirmDelete({
  taskName,
  t,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-title">{t("notepadConfirmDelete")}</p>
        {taskName && <p className="confirm-name">«{taskName}»</p>}
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>
            {t("notepadConfirmNo")}
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {t("notepadConfirmYes")}
          </button>
        </div>
      </div>
    </div>
  );
}
