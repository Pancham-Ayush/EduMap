export const PO_COUNT = 12;

export const PO_STATEMENTS = {
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

export const levelConfig = (level) => {
    if (level === 3) return { bg: "rgba(245, 224, 138, 0.75)", color: "#6f8d26", border: "rgba(122,154,47,0.45)" };
    if (level === 2) return { bg: "rgba(255, 231, 174, 0.95)", color: "#c78f1e", border: "rgba(212,160,23,0.4)" };
    if (level === 1) return { bg: "rgba(255, 241, 214, 1)", color: "#b97919", border: "rgba(197,106,45,0.3)" };
    return { bg: "transparent", color: "rgba(182,145,77,0.8)", border: "transparent" };
};

export const glassCard = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 16,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
};

export const inputStyle = {
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
