import type { TranslationFn } from "../../hooks/useTranslation";
import type { Task } from "./notepadUtils";
import NotepadItem from "./NotepadItem";

type Props = {
  tasks: Task[];
  activeTab: string;
  copiedId: string | null;
  t: TranslationFn;
  onUpdateTask: (id: string, patch: Partial<Task>) => void;
  onCopyTask: (id: string, content: string) => void;
  onDeleteRequest: (id: string) => void;
};

export default function NotepadList({
  tasks,
  activeTab,
  copiedId,
  t,
  onUpdateTask,
  onCopyTask,
  onDeleteRequest,
}: Props) {
  return (
    <div className="notepad-list" data-tab={activeTab}>
      {tasks.length === 0 && (
        <div className="empty">{t("notepadEmpty")}</div>
      )}
      {tasks.map((task) => (
        <NotepadItem
          key={task.id}
          task={task}
          copiedId={copiedId}
          t={t}
          onUpdate={onUpdateTask}
          onCopy={onCopyTask}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
