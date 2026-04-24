export default function computeMapping(co, poIndex) {
    const poKey = `PO${poIndex}`;
    const keywords = Array.isArray(co?.keywords) ? co.keywords : [];
    const matchedKeywords = [];
    const unmatchedKeywords = [];
    let totalMatches = 0;

    keywords.forEach((keyword) => {
        const reasons = Array.isArray(keyword?.reasons) ? keyword.reasons : [];
        const matchedReasons = reasons
            .filter((reason) => reason.po === poKey)
            .map((reason) => reason.reason);

        if (matchedReasons.length > 0) {
            matchedKeywords.push({
                keyword: keyword?.keyword || "Unnamed keyword",
                reasons: matchedReasons,
                count: matchedReasons.length,
            });
            totalMatches += matchedReasons.length;
        } else {
            unmatchedKeywords.push({
                keyword: keyword?.keyword || "Unnamed keyword",
            });
        }
    });

    const rawScore = totalMatches / 3;
    const finalLevel = rawScore >= 0.75 ? 3 : rawScore >= 0.5 ? 2 : rawScore >= 0.25 ? 1 : 0;

    return {
        matchedKeywords,
        unmatchedKeywords,
        totalMatches,
        rawScore,
        finalLevel,
    };
}
