import { levelConfig } from "../constants";

export default function LevelBadge({ level }) {
    const c = levelConfig(level);
    return (
        <span style={{
            display: "inline-block", minWidth: 28, padding: "2px 8px", borderRadius: 6,
            fontSize: 12, fontWeight: 600, background: c.bg, color: c.color,
            border: `1px solid ${c.border}`, textAlign: "center", letterSpacing: "0.02em",
        }}>
      {level || "—"}
    </span>
    );
}