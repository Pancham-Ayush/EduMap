import { useState } from "react";
import { levelConfig, PO_STATEMENTS } from "../constants";
import LevelBadge from "./LevelBadge";
import { C } from "../styles";

export default function MappingPopup({ popup, onClose }) {
    const [popupFilter, setPopupFilter] = useState("all");

    if (!popup) return null;

    const c = levelConfig(popup.finalLevel);
    const threshold =
        popup.finalLevel === 3 ? "0.75"
            : popup.finalLevel === 2 ? "0.50"
                : "0.25";

    const allKeywords = [
        ...popup.matchedKeywords.map(k => ({ ...k, matched: true })),
        ...popup.unmatchedKeywords.map(k => ({ ...k, matched: false })),
    ];

    const visibleKeywords =
        popupFilter === "matched" ? allKeywords.filter(k => k.matched)
            : popupFilter === "unmatched" ? allKeywords.filter(k => !k.matched)
                : allKeywords;

    return (
        <div
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: "fixed", inset: 0, background: "rgba(79,53,16,0.28)",
                backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1000, padding: 16,
            }}
        >
            <div style={{
                background: "#fff8e0", border: `1px solid ${C.border}`,
                borderRadius: 20, width: "100%", maxWidth: 620,
                maxHeight: "90vh", display: "flex", flexDirection: "column",
                boxShadow: "0 24px 80px rgba(120,87,16,0.22)", overflow: "hidden",
            }}>

                {/* Sticky Header */}
                <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>CO–PO keyword breakdown</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.text }}>PO{popup.poIndex} correlation</p>
                                <LevelBadge level={popup.finalLevel} />
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: "rgba(255,239,196,0.85)", border: `1px solid ${C.border}`, borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: C.textSec, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>

                    {/* CO text */}
                    <div style={{ background: "rgba(255,252,245,0.95)", borderRadius: 10, padding: "10px 14px", borderLeft: `2px solid ${C.borderHi}`, marginBottom: 12 }}>
                        <p style={{ margin: 0, fontSize: 10, color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Course outcome</p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{popup.co.CO}</p>
                    </div>

                    {/* PO statement */}
                    <div style={{ background: "rgba(255,231,174,0.55)", borderRadius: 10, padding: "10px 14px", borderLeft: `2px solid ${C.borderHi}`, marginBottom: 14 }}>
                        <p style={{ margin: 0, fontSize: 10, color: C.blueDk, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>PO{popup.poIndex}</p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{PO_STATEMENTS[`PO${popup.poIndex}`]}</p>
                    </div>

                    {/* Filter tabs */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                        {[
                            { key: "all", label: `All keywords (${allKeywords.length})` },
                            { key: "matched", label: `✓ Matched (${popup.matchedKeywords.length})`, color: "#34d399" },
                            { key: "unmatched", label: `✗ Not matched (${popup.unmatchedKeywords.length})`, color: "rgba(255,80,80,0.85)" },
                        ].map(f => (
                            <button key={f.key} onClick={() => setPopupFilter(f.key)} style={{
                                padding: "5px 13px", fontSize: 11, fontWeight: 500, borderRadius: 20,
                                cursor: "pointer", transition: "all 0.15s",
                                background: popupFilter === f.key ? "rgba(255,231,174,0.7)" : "rgba(255,252,245,0.9)",
                                color: popupFilter === f.key ? (f.color || C.text) : C.textSec,
                                border: popupFilter === f.key ? `1px solid ${C.borderHi}` : `1px solid ${C.border}`,
                            }}>{f.label}</button>
                        ))}
                    </div>

                    <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 0 }} />
                </div>

                {/* Scrollable body */}
                <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>

                    {/* Keyword cards */}
                    {visibleKeywords.length === 0 ? (
                        <p style={{ color: C.textSec, fontSize: 13, textAlign: "center", padding: "24px 0" }}>No keywords to show.</p>
                    ) : (
                        <div style={{ marginBottom: 20 }}>
                            {visibleKeywords.map((k, i) => (
                                <div key={i} style={{
                                    marginBottom: 10, borderRadius: 11, overflow: "hidden",
                                    border: k.matched ? "1px solid rgba(122,154,47,0.25)" : `1px solid ${C.border}`,
                                    background: k.matched ? "rgba(245,224,138,0.4)" : "rgba(255,252,245,0.95)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: k.matched ? "1px solid rgba(122,154,47,0.18)" : `1px solid ${C.border}` }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                          background: k.matched ? "#7a9a2f" : "#c56a2d",
                          boxShadow: k.matched ? "0 0 6px rgba(122,154,47,0.35)" : "none",
                      }} />
                                            <span style={{
                                                fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                                                background: k.matched ? "rgba(245,224,138,0.7)" : "rgba(255,250,232,0.92)",
                                                color: k.matched ? "#6f8d26" : C.textSec,
                                                border: k.matched ? "1px solid rgba(122,154,47,0.25)" : `1px solid ${C.border}`,
                                            }}>{k.keyword}</span>
                                        </div>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600,
                                            color: k.matched ? "#6f8d26" : "#b6632e",
                                            background: k.matched ? "rgba(245,224,138,0.65)" : "rgba(255,241,214,1)",
                                            border: k.matched ? "1px solid rgba(122,154,47,0.2)" : "1px solid rgba(197,106,45,0.2)",
                                            padding: "2px 10px", borderRadius: 20,
                                        }}>
                      {k.matched ? `+${k.count} match${k.count !== 1 ? "es" : ""}` : "no match"}
                    </span>
                                    </div>

                                    <div style={{ padding: "10px 14px" }}>
                                        {k.matched ? (
                                            k.reasons.map((r, j) => (
                                                <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: j < k.reasons.length - 1 ? 6 : 0 }}>
                                                    <span style={{ color: "#7a9a2f", fontSize: 11, marginTop: 2, flexShrink: 0 }}>→</span>
                                                    <p style={{ margin: 0, fontSize: 12, color: C.textSec, lineHeight: 1.55 }}>{r}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ margin: 0, fontSize: 11, color: C.textSec }}>
                                                This keyword did not match <strong style={{ color: C.text }}>PO{popup.poIndex}</strong>.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Full Math Section */}
                    <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                        <div style={{ background: "rgba(255,239,196,0.8)", padding: "8px 14px", borderBottom: `1px solid ${C.border}` }}>
                            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Level calculation</p>
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.textSec, background: "rgba(255,252,245,0.95)", borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 12, lineHeight: 2.1 }}>
                                <div>
                                    Keywords from CO:&nbsp;
                                    <strong style={{ color: C.text }}>{popup.matchedKeywords.length + popup.unmatchedKeywords.length}</strong>
                                    &nbsp;total&nbsp;
                                    (<span style={{ color: "#7a9a2f" }}>{popup.matchedKeywords.length} matched</span>,&nbsp;
                                    <span style={{ color: "#c56a2d" }}>{popup.unmatchedKeywords.length} unmatched</span>)
                                </div>
                                <div>
                                    Total reasons matched (n) =&nbsp;
                                    {popup.matchedKeywords.map((k, i) => (
                                        <span key={i}>
                      {i > 0 ? " + " : ""}
                                            <span style={{ color: "#7a9a2f" }}>{k.count}</span>
                      <span style={{ color: C.textDim, fontSize: 11 }}> [{k.keyword}]</span>
                    </span>
                                    ))}
                                    {popup.matchedKeywords.length === 0 && <span style={{ color: "#c56a2d" }}>0</span>}
                                    &nbsp;= <strong style={{ color: C.text }}>{popup.totalMatches}</strong>
                                </div>
                                <div>Divisor (d) = <strong style={{ color: C.text }}>3</strong></div>
                                <div>
                                    Raw score = n ÷ d = {popup.totalMatches} ÷ 3 = <strong style={{ color: C.text }}>{popup.rawScore.toFixed(4)}</strong>
                                </div>
                            </div>

                            {/* Score bar */}
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textDim, marginBottom: 5 }}>
                                    <span>0.00</span>
                                    <span style={{ color: "#c56a2d" }}>0.25 → L1</span>
                                    <span style={{ color: "#d4a017" }}>0.50 → L2</span>
                                    <span style={{ color: "#7a9a2f" }}>0.75 → L3</span>
                                    <span>1.0+</span>
                                </div>
                                <div style={{ position: "relative", height: 8, background: "rgba(255,239,196,0.9)", borderRadius: 4, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${Math.min(popup.rawScore, 1) * 100}%`, background: c.color, borderRadius: 4, minWidth: popup.rawScore > 0 ? 4 : 0 }} />
                                    {[25, 50, 75].map(t => (
                                        <div key={t} style={{ position: "absolute", top: 0, bottom: 0, left: `${t}%`, width: 1, background: C.borderHi }} />
                                    ))}
                                </div>
                            </div>

                            {/* Threshold rules */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                                {[
                                    { label: "score ≥ 0.75", level: 3, desc: "High",   color: "#7a9a2f",               border: "rgba(122,154,47,0.25)",  bg: "rgba(245,224,138,0.55)" },
                                    { label: "score ≥ 0.50", level: 2, desc: "Medium", color: "#d4a017",               border: "rgba(212,160,23,0.25)",  bg: "rgba(255,231,174,0.65)" },
                                    { label: "score ≥ 0.25", level: 1, desc: "Low",    color: "#c56a2d",               border: "rgba(197,106,45,0.25)",  bg: "rgba(255,241,214,1)" },
                                    { label: "score < 0.25", level: 0, desc: "None",   color: C.textDim, border: "rgba(230,207,139,0.6)",  bg: "rgba(255,252,245,0.95)" },
                                ].map(t => (
                                    <div key={t.level} style={{
                                        padding: "7px 10px", borderRadius: 8,
                                        background: popup.finalLevel === t.level ? t.bg : "rgba(255,252,245,0.95)",
                                        border: popup.finalLevel === t.level ? `1px solid ${t.border}` : `1px solid ${C.border}`,
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <span style={{ fontSize: 11, color: popup.finalLevel === t.level ? t.color : C.textDim, fontFamily: "monospace" }}>{t.label}</span>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: popup.finalLevel === t.level ? t.color : C.textDim }}>L{t.level} {t.desc}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Final result */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, background: c.bg, border: `1px solid ${c.border}` }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: c.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Final mapping level — PO{popup.poIndex}</p>
                                    <p style={{ margin: "3px 0 0", fontSize: 12, color: c.color, opacity: 0.8 }}>
                                        {popup.rawScore.toFixed(4)}&nbsp;
                                        {popup.finalLevel > 0 ? `≥ ${threshold} → Level ${popup.finalLevel}` : `< 0.25 → no mapping`}
                                    </p>
                                </div>
                                <span style={{ fontSize: 32, fontWeight: 700, color: c.color }}>{popup.finalLevel}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
