import React, { useState } from "react";

const PO_COUNT = 12;

const PO_STATEMENTS = {
  PO1: "Engineering knowledge — Apply knowledge of mathematics, science, engineering fundamentals, and an engineering specialisation.",
  PO2: "Problem analysis — Identify, formulate, review research literature, and analyze complex engineering problems.",
  PO3: "Design/development of solutions — Design solutions for complex engineering problems and systems.",
  PO4: "Conduct investigations — Use research-based knowledge and methods including design of experiments.",
  PO5: "Modern tool usage — Create, select, and apply appropriate techniques and modern engineering tools.",
  PO6: "The engineer and society — Apply reasoning informed by contextual knowledge to assess societal issues.",
  PO7: "Environment and sustainability — Understand the impact of engineering solutions in societal and environmental contexts.",
  PO8: "Ethics — Apply ethical principles and commit to professional ethics and responsibilities.",
  PO9: "Individual and team work — Function effectively as an individual and as a member or leader in diverse teams.",
  PO10: "Communication — Communicate effectively on complex engineering activities with the engineering community.",
  PO11: "Project management and finance — Demonstrate knowledge and understanding of engineering and management principles.",
  PO12: "Life-long learning — Recognise the need for, and have the preparation and ability to engage in independent learning.",
};

const levelConfig = (level) => {
  if (level === 3) return { bg: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "rgba(52, 211, 153, 0.4)", glow: "rgba(52, 211, 153, 0.25)" };
  if (level === 2) return { bg: "rgba(251, 191, 36, 0.12)", color: "#fbbf24", border: "rgba(251, 191, 36, 0.4)", glow: "rgba(251, 191, 36, 0.2)" };
  if (level === 1) return { bg: "rgba(96, 165, 250, 0.12)", color: "#60a4fa", border: "rgba(96, 165, 250, 0.35)", glow: "rgba(96, 165, 250, 0.2)" };
  return { bg: "transparent", color: "rgba(255,255,255,0.2)", border: "transparent", glow: "transparent" };
};

const LevelBadge = ({ level }) => {
  const c = levelConfig(level);
  return (
      <span style={{
        display: "inline-block",
        minWidth: 28,
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        textAlign: "center",
        letterSpacing: "0.02em",
      }}>
      {level || "—"}
    </span>
  );
};

const glassCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 16,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#fff",
  padding: "9px 13px",
  fontSize: 13,
  outline: "none",
  marginBottom: 14,
  transition: "border-color 0.2s",
};

export default function App() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [cos, setCos] = useState([""]);
  const [tableData, setTableData] = useState(null);
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("add");

  const addCO = () => setCos(prev => [...prev, ""]);
  const removeCO = (index) => setCos(prev => prev.filter((_, i) => i !== index));
  const updateCO = (value, index) => {
    const updated = [...cos];
    updated[index] = value;
    setCos(updated);
  };

  const submitCourse = async () => {
    const filteredCOs = cos.filter(c => c.trim() !== "");
    if (!courseCode || !courseName || filteredCOs.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);
      const res1 = await fetch("http://localhost:8081/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode, courseName, courseDescription }),
      });
      if (!res1.ok) throw new Error("Course API failed");
      const res2 = await fetch("http://localhost:8081/add-cos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseCode, cos: filteredCOs }),
      });
      if (!res2.ok) throw new Error("CO API failed");
      alert("Saved successfully!");
      setCos([""]);
      setCourseCode("");
      setCourseName("");
      setCourseDescription("");
    } catch (err) {
      console.error(err);
      alert("Error: Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async () => {
    if (!courseCode) { alert("Enter a course code first."); return; }
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8081/course?courseCode=${courseCode}`);
      const data = await res.json();
      setTableData({ ...data, courseOutcomesList: data.courseOutcomesList || [] });
      setActiveTab("view");
    } catch (err) {
      console.error(err);
      alert("Fetch error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const computeMapping = (co, poIndex) => {
    const poKey = `PO${poIndex}`;
    let matchedKeywords = [];
    let totalMatches = 0;
    co.keywords.forEach(k => {
      const matched = k.reasons.filter(r => r.po === poKey).map(r => r.reason);
      if (matched.length) {
        matchedKeywords.push({ keyword: k.keyword, reasons: matched, count: matched.length });
        totalMatches += matched.length;
      }
    });
    const rawScore = totalMatches / 3;
    const finalLevel = rawScore >= 0.75 ? 3 : rawScore >= 0.5 ? 2 : rawScore >= 0.25 ? 1 : 0;
    return { matchedKeywords, totalMatches, rawScore, finalLevel };
  };

  const openPopup = (co, poIndex) => {
    const mapping = computeMapping(co, poIndex);
    setPopup({ co, poIndex, ...mapping });
  };

  return (
      <div style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        padding: "28px 20px",
      }}>
        {/* Subtle ambient orbs */}
        <div style={{ position: "fixed", top: -120, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: -100, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a4fa", boxShadow: "0 0 8px #60a4fa" }} />
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: "#fff" }}>CO-PO Mapping System</h1>
            </div>
            <p style={{ margin: "0 0 0 20px", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>AI-assisted keyword analysis for program outcome mapping</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, marginBottom: 24, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.07)", width: "fit-content" }}>
            {["add", "view"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: "7px 20px",
                  fontSize: 13,
                  fontWeight: 500,
                  background: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                  color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                  border: activeTab === tab ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                  borderRadius: 9,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {tab === "add" ? "Add / Edit course" : "View mapping"}
                </button>
            ))}
          </div>

          {/* Add Tab */}
          {activeTab === "add" && (
              <div>
                <div style={{ ...glassCard, padding: "22px 24px", marginBottom: 14 }}>
                  <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Course details</p>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 5 }}>Course code *</label>
                  <input style={inputStyle} placeholder="e.g. CS301" value={courseCode} onChange={e => setCourseCode(e.target.value)} />
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 5 }}>Course name *</label>
                  <input style={inputStyle} placeholder="e.g. Data Structures" value={courseName} onChange={e => setCourseName(e.target.value)} />
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 5 }}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Brief description..." value={courseDescription} onChange={e => setCourseDescription(e.target.value)} />
                </div>

                <div style={{ ...glassCard, padding: "22px 24px", marginBottom: 20 }}>
                  <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Course outcomes</p>
                  {cos.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#60a4fa", minWidth: 38, opacity: 0.8 }}>CO{i + 1}</span>
                        <input style={{ ...inputStyle, flex: 1, marginBottom: 0 }} value={c} placeholder={`Describe outcome ${i + 1}...`} onChange={e => updateCO(e.target.value, i)} />
                        {cos.length > 1 && (
                            <button onClick={() => removeCO(i)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>−</button>
                        )}
                      </div>
                  ))}
                  <button onClick={addCO} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "transparent", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", marginTop: 4 }}>+ Add outcome</button>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button disabled={loading} onClick={submitCourse} style={{ padding: "9px 22px", fontSize: 13, fontWeight: 600, background: "rgba(96,165,250,0.15)", color: "#60a4fa", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
                    {loading ? "Saving..." : "Save course"}
                  </button>
                  <button disabled={loading} onClick={fetchCourse} style={{ padding: "9px 22px", fontSize: 13, fontWeight: 500, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, cursor: "pointer" }}>
                    {loading ? "Loading..." : "Fetch and view"}
                  </button>
                </div>
              </div>
          )}

          {/* View Tab */}
          {activeTab === "view" && (
              <div>
                {!tableData ? (
                    <div style={{ ...glassCard, padding: "48px 24px", textAlign: "center" }}>
                      <p style={{ color: "rgba(255,255,255,0.3)", marginBottom: 18, fontSize: 14 }}>Enter a course code to view the mapping.</p>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <input placeholder="Course code" value={courseCode} onChange={e => setCourseCode(e.target.value)} style={{ ...inputStyle, maxWidth: 200, marginBottom: 0 }} />
                        <button disabled={loading} onClick={fetchCourse} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, background: "rgba(96,165,250,0.15)", color: "#60a4fa", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 10, cursor: "pointer" }}>Fetch</button>
                      </div>
                    </div>
                ) : (
                    <div>
                      <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#fff" }}>{tableData.courseName}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{tableData.courseCode}</p>
                        </div>
                        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.4)", alignItems: "center" }}>
                          {[
                            { label: "High (3)", color: "#34d399", glow: "rgba(52,211,153,0.5)" },
                            { label: "Medium (2)", color: "#fbbf24", glow: "rgba(251,191,36,0.5)" },
                            { label: "Low (1)", color: "#60a4fa", glow: "rgba(96,165,250,0.5)" },
                          ].map(l => (
                              <span key={l.label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: l.color, boxShadow: `0 0 6px ${l.glow}` }} />
                                {l.label}
                      </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
                          <thead>
                          <tr>
                            <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.06em" }}>CO</th>
                            <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", minWidth: 200, textTransform: "uppercase", letterSpacing: "0.06em" }}>Outcome</th>
                            {[...Array(PO_COUNT)].map((_, i) => (
                                <th key={i} style={{ padding: "11px 10px", textAlign: "center", fontWeight: 600, fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.06em" }}>PO{i + 1}</th>
                            ))}
                          </tr>
                          </thead>
                          <tbody>
                          {tableData.courseOutcomesList.map((co, index) => (
                              <tr key={index} style={{ transition: "background 0.1s" }}>
                                <td style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#60a4fa", fontSize: 12, fontWeight: 600 }}>CO{index + 1}</td>
                                <td style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", maxWidth: 220, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{co.CO}</td>
                                {[...Array(PO_COUNT)].map((_, i) => {
                                  const { finalLevel } = computeMapping(co, i + 1);
                                  const c = levelConfig(finalLevel);
                                  return (
                                      <td key={i}
                                          onClick={() => finalLevel > 0 && openPopup(co, i + 1)}
                                          title={finalLevel > 0 ? "Click for details" : "No mapping"}
                                          style={{
                                            padding: "10px 10px",
                                            textAlign: "center",
                                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                                            cursor: finalLevel > 0 ? "pointer" : "default",
                                            background: finalLevel > 0 ? c.bg : "transparent",
                                            transition: "background 0.15s",
                                          }}>
                                        {finalLevel > 0 ? <LevelBadge level={finalLevel} /> : <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>}
                                      </td>
                                  );
                                })}
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                        <input placeholder="Course code" value={courseCode} onChange={e => setCourseCode(e.target.value)} style={{ ...inputStyle, maxWidth: 200, marginBottom: 0 }} />
                        <button disabled={loading} onClick={fetchCourse} style={{ padding: "9px 18px", fontSize: 13, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, cursor: "pointer" }}>Refresh</button>
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        {/* Popup */}
        {popup && (
            <div
                onClick={e => { if (e.target === e.currentTarget) setPopup(null); }}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
            >
              <div style={{
                background: "#111117",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 18,
                padding: "26px 28px",
                width: "100%",
                maxWidth: 560,
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>CO-PO mapping details</p>
                    <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600, color: "#fff" }}>PO{popup.poIndex} correlation</p>
                  </div>
                  <button onClick={() => setPopup(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px", marginBottom: 10, borderLeft: "2px solid rgba(255,255,255,0.15)" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Course outcome</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{popup.co.CO}</p>
                </div>

                <div style={{ background: "rgba(96,165,250,0.08)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, borderLeft: "2px solid rgba(96,165,250,0.5)" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#60a4fa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Program outcome — PO{popup.poIndex}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(96,165,250,0.8)", lineHeight: 1.5 }}>{PO_STATEMENTS[`PO${popup.poIndex}`]}</p>
                </div>

                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Keyword mapping</p>
                {popup.matchedKeywords.length > 0 ? (
                    <div style={{ marginBottom: 20 }}>
                      {popup.matchedKeywords.map((m, i) => (
                          <div key={i} style={{ marginBottom: 10, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: "rgba(96,165,250,0.12)", color: "#60a4fa", border: "1px solid rgba(96,165,250,0.25)" }}>{m.keyword}</span>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{m.count} match{m.count !== 1 ? "es" : ""}</span>
                            </div>
                            {m.reasons.map((r, j) => (
                                <p key={j} style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)", paddingLeft: 10, borderLeft: "2px solid rgba(255,255,255,0.1)", lineHeight: 1.5 }}>{r}</p>
                            ))}
                          </div>
                      ))}
                    </div>
                ) : (
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>No keyword matches found for this CO-PO pair.</p>
                )}

                <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Level calculation</p>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "6px 16px", fontSize: 13, marginBottom: 14 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>Total keyword matches (n)</span>
                      <span style={{ fontWeight: 600, textAlign: "right", color: "#fff" }}>{popup.totalMatches}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>Divisor (d)</span>
                      <span style={{ fontWeight: 600, textAlign: "right", color: "#fff" }}>3</span>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>Raw score = {popup.totalMatches} / 3</span>
                      <span style={{ fontWeight: 600, textAlign: "right", color: "#fff" }}>{popup.rawScore.toFixed(4)}</span>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 2, marginBottom: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Threshold rules</span><br />
                      score ≥ 0.75 → <strong style={{ color: "#34d399" }}>Level 3</strong> (high)<br />
                      score ≥ 0.50 → <strong style={{ color: "#fbbf24" }}>Level 2</strong> (medium)<br />
                      score ≥ 0.25 → <strong style={{ color: "#60a4fa" }}>Level 1</strong> (low)<br />
                      score &lt; 0.25 → <strong style={{ color: "rgba(255,255,255,0.3)" }}>Level 0</strong> (none)
                    </div>

                    {(() => {
                      const c = levelConfig(popup.finalLevel);
                      return (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, background: c.bg, border: `1px solid ${c.border}` }}>
                            <div>
                              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: c.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Final mapping level</p>
                              <p style={{ margin: "2px 0 0", fontSize: 12, color: c.color, opacity: 0.8 }}>
                                {popup.rawScore.toFixed(4)} satisfies score ≥ {popup.finalLevel === 3 ? "0.75" : popup.finalLevel === 2 ? "0.50" : popup.finalLevel === 1 ? "0.25" : "none"}
                              </p>
                            </div>
                            <span style={{ fontSize: 30, fontWeight: 700, color: c.color }}>{popup.finalLevel}</span>
                          </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}