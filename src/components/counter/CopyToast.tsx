type Props = {
  show: boolean;
  text: string;
};

export default function CopyToast({ show, text }: Props) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--surface)",
        padding: "10px 16px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        fontSize: 12,
      }}
    >
      {text}
    </div>
  );
}
