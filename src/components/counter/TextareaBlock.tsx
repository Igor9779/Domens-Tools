type Props = {
  text: string;
  setText: (v: string) => void;
  placeholder: string;
};

export default function TextareaBlock({ text, setText, placeholder }: Props) {
  return (
    <div className="textarea-wrap">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
}
