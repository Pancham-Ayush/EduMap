import { C, inputStyle } from "../styles";
import { PO_COUNT, levelConfig } from "../constants";
import LevelBadge from "../components/LevelBadge";

// ── helper: compute mapping for one CO × one PO ──────────────────
export function computeMapping(co, poIndex) {
    const poKey = `PO${poIndex}`;
    let matchedKeywords = [];
    let unmatchedKeywords = [];
    let totalMatches = 0;
    const keywords = Array.isArray(co?.keywords) ? co.keywords : [];

    keywords.forEach(k => {
        const reasons = Array.isArray(k?.reasons) ? k.reasons : [];
        const matchedReasons = reasons
            .filter(r => r.po === poKey)
            .map(r => r.reason);

        if (matchedReasons.length > 0) {
            matchedKeywords.push({ keyword: k?.keyword || "Unnamed keyword", reasons: matchedReasons, count: matchedReasons.length });
            totalMatches += matchedReasons.length;
        } else {
            unmatchedKeywords.push({ keyword: k?.keyword || "Unnamed keyword" });
        }
    });

    const rawScore  = totalMatches / 3;
    const finalLevel = rawScore >= 0.75 ? 3 : rawScore >= 0.5 ? 2 : rawScore >= 0.25 ? 1 : 0;
    return { matchedKeywords, unmatchedKeywords, totalMatches, rawScore, finalLevel };
}

// ─────────────────────────────────────────────────────────────────
export default function ShowMapping({
                                        tableData,
                                        fetchCode, setFetchCode,
                                        fetchCourse, loading,
                                        onOpenPopup,
                                    }) {
    if (!tableData) {
        return (
            <div style={{
                background: "rgba(255,250,232,0.94)", border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "48px 24px", textAlign: "center",
            }}>
                <p style={{ color: C.textSec, marginBottom: 18, fontSize: 14 }}>
                    Enter a course code to view the mapping.
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <input
                        placeholder="Course code"
                        value={fetchCode}
                        onChange={e => setFetchCode(e.target.value)}
                        style={{ ...inputStyle(), maxWidth: 200, marginBottom: 0 }}
                    />
                    <button
                        disabled={loading}
                        onClick={fetchCourse}
                        style={{
                            padding: "9px 18px", fontSize: 13, fontWeight: 600,
                            background: "rgba(240,180,41,0.16)", color: C.blueDk,
                            border: `1px solid ${C.borderHi}`, borderRadius: 10, cursor: "pointer",
                        }}
                    >Fetch</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header row */}
            <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{tableData.courseName}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textSec }}>{tableData.courseCode}</p>
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.textSec, alignItems: "center" }}>
                    {[{ label: "High (3)", color: "#7a9a2f" }, { label: "Medium (2)", color: "#d4a017" }, { label: "Low (1)", color: "#c56a2d" }].map(l => (
                        <span key={l.label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                            {l.label}
            </span>
                    ))}
                </div>
            </div>

            {/* Matrix table */}
            <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(255,250,232,0.9)" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
                    <thead>
                    <tr>
                        {["CO", "Outcome", ...Array.from({ length: PO_COUNT }, (_, i) => `PO${i + 1}`)].map((h, i) => (
                            <th key={h} style={{
                                padding: i < 2 ? "11px 14px" : "11px 10px",
                                textAlign: i < 2 ? "left" : "center",
                                fontWeight: 600, fontSize: 11,
                                color: C.textDim,
                                background: "rgba(255,239,196,0.8)",
                                borderBottom: `1px solid ${C.border}`,
                                textTransform: "uppercase", letterSpacing: "0.06em",
                                ...(i === 1 ? { minWidth: 200 } : {}),
                                whiteSpace: "nowrap",
                            }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {(tableData.courseOutcomesList || []).map((co, index) => (
                        <tr key={index}>
                            <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, color: C.blueDk, fontSize: 12, fontWeight: 600 }}>
                                CO{index + 1}
                            </td>
                            <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, maxWidth: 220, fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
                                {co.CO}
                            </td>
                            {Array.from({ length: PO_COUNT }, (_, i) => {
                                const mapping = computeMapping(co, i + 1);
                                const { finalLevel } = mapping;
                                const c = levelConfig(finalLevel);
                                return (
                                    <td
                                        key={i}
                                        onClick={() => onOpenPopup({
                                            co,
                                            poIndex: i + 1,
                                            ...mapping,
                                        })}
                                        title="Click for keyword breakdown"
                                        style={{
                                            padding: "10px 10px", textAlign: "center",
                                            borderBottom: `1px solid ${C.border}`,
                                            cursor: "pointer",
                                            background: finalLevel > 0 ? c.bg : "transparent",
                                            transition: "background 0.15s",
                                        }}
                                    >
                                        {finalLevel > 0
                                            ? <LevelBadge level={finalLevel} />
                                            : <span style={{ color: C.textDim, fontSize: 13 }}>—</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Refresh row */}
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <input
                    placeholder="Course code"
                    value={fetchCode}
                    onChange={e => setFetchCode(e.target.value)}
                    style={{ ...inputStyle(), maxWidth: 200, marginBottom: 0 }}
                />
                <button
                    disabled={loading}
                    onClick={fetchCourse}
                    style={{
                        padding: "9px 18px", fontSize: 13,
                        background: "rgba(255,239,196,0.85)", color: C.textSec,
                        border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer",
                    }}
                >Refresh</button>
            </div>
        </div>
    );
}
