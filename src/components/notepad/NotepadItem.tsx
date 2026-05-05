import type { TranslationFn } from "../../hooks/useTranslation";
import type { Task } from "./notepadUtils";

type Props = {
  task: Task;
  copiedId: string | null;
  t: TranslationFn;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onCopy: (id: string, content: string) => void;
  onDeleteRequest: (id: string) => void;
};

export default function NotepadItem({
  task,
  copiedId,
  t,
  onUpdate,
  onCopy,
  onDeleteRequest,
}: Props) {
  return (
    <div className={`notepad-item ${task.expanded ? "expanded" : ""}`}>
      <div
        className="notepad-item-header"
        onClick={() => onUpdate(task.id, { expanded: !task.expanded })}
      >
        <span className="notepad-chevron">{task.expanded ? "▾" : "▸"}</span>
        <input
          className="notepad-name-input"
          value={task.name}
          placeholder={t("notepadDefaultName")}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onUpdate(task.id, { name: e.target.value })}
        />
        <button
          className="notepad-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(task.id);
          }}
        >
          ×
        </button>
      </div>

      {task.expanded && (
        <div className="notepad-item-body">
          <textarea
            className="notepad-textarea"
            placeholder={t("notepadPlaceholder")}
            value={task.content}
            onChange={(e) => onUpdate(task.id, { content: e.target.value })}
          />
          <div className="notepad-item-actions">
            <button
              className="btn-secondary"
              onClick={() => onUpdate(task.id, { content: "" })}
            >
              {t("notepadClear")}
            </button>
            <button
              className="btn-primary"
              onClick={() => onCopy(task.id, task.content)}
            >
              {copiedId === task.id ? "✓" : t("notepadCopy")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
