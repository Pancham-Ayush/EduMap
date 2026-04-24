import { C, FSANS, inputStyle, btnStyle } from '../styles';
import { GlassCard, PageTitle, SectionLabel } from '../components/UI';

export default function AddCourse({
                                      courseCode, setCourseCode,
                                      courseName, setCourseName,
                                      cos, updateCO, addCO, saveCourse,
                                  }) {
    return (
        <div style={{ padding: '1.25rem', fontFamily: FSANS }}>
            <PageTitle title="Add Course" sub="Define course details and outcomes, then save to backend" />

            {/* Course Info */}
            <GlassCard style={{ padding: '1.4rem', marginBottom: '1rem' }}>
                <SectionLabel>Course Information</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: 10, color: C.textSec, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Course Code
                        </label>
                        <input
                            value={courseCode}
                            onChange={e => setCourseCode(e.target.value)}
                            placeholder="e.g. CS301"
                            style={{ ...inputStyle(), width: '100%', height: 36 }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 10, color: C.textSec, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Course Name
                        </label>
                        <input
                            value={courseName}
                            onChange={e => setCourseName(e.target.value)}
                            placeholder="e.g. Data Structures"
                            style={{ ...inputStyle(), width: '100%', height: 36 }}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Course Outcomes */}
            <GlassCard style={{ padding: '1.4rem' }}>
                <SectionLabel>Course Outcomes (COs)</SectionLabel>

                {cos.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                        <div style={{
                            width: 40, height: 34, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(240,180,41,0.14)', border: `1px solid rgba(212,160,23,0.35)`,
                            color: C.blueLt, fontSize: 11, fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            CO{i + 1}
                        </div>
                        <input
                            value={c}
                            onChange={e => updateCO(e.target.value, i)}
                            placeholder={`Describe CO${i + 1} — use domain-specific keywords`}
                            style={{ ...inputStyle(), flex: 1, height: 36 }}
                            onFocus={e => e.target.style.borderColor = '#d4a017'}
                            onBlur={e => e.target.style.borderColor = '#e6cf8b'}
                        />
                    </div>
                ))}

                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button onClick={addCO} style={btnStyle('blue')}>
                        + Add CO
                    </button>
                    <button onClick={saveCourse} style={btnStyle('indigo')}>
                        Save to Backend
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
