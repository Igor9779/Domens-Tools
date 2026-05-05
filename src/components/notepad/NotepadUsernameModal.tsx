import { useRef, useEffect, useState } from "react";
import type { TranslationFn } from "../../hooks/useTranslation";

type Props = {
  initialValue?: string;
  t: TranslationFn;
  onSave: (username: string) => void;
  onCancel: () => void;
};

export default function NotepadUsernameModal({
  initialValue = "",
  t,
  onSave,
  onCancel,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
  };

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-title">{t("notepadUsernameModalTitle")}</p>
        <input
          ref={inputRef}
          className="notepad-username-input"
          type="text"
          placeholder={t("notepadUsernamePlaceholder")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <div className="confirm-actions notepad-username-actions">
          <button className="btn-secondary" onClick={onCancel}>
            {t("notepadConfirmNo")}
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!value.trim()}
          >
            {t("notepadUsernameSaveBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
