import { C, LEVEL_CFG, FSANS } from '../styles';
import { GlassCard, PageTitle, SectionLabel } from '../components/UI';

export default function Dashboard({ setPage }) {
    const cards = [
        {
            title: 'Add a New Course',
            desc: 'Enter course code, name and define Course Outcomes (COs). Save to backend for mapping and scoring.',
            nav: 'add',
            label: 'Go to Add Course →',
            color: C.blueLt,
            accent: 'rgba(212,160,23,0.4)',
        },
        {
            title: 'View CO–PO Mapping',
            desc: 'Fetch any course by code and view the full PO1–PO12 matrix with keyword correlation rank scores.',
            nav: 'view',
            label: 'Go to Mapping →',
            color: C.indigo,
            accent: 'rgba(199,143,30,0.4)',
        },
    ];

    return (
        <div style={{ padding: '1.25rem', fontFamily: FSANS }}>
            <PageTitle title="Dashboard" sub="Quick access to all features — CO–PO mapping system" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {cards.map(c => (
                    <GlassCard key={c.nav} style={{ padding: '1.4rem' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: c.color, marginBottom: '0.625rem' }}>
                            {c.title}
                        </div>
                        <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.65, marginBottom: '1.1rem' }}>
                            {c.desc}
                        </p>
                        <button
                            onClick={() => setPage(c.nav)}
                            style={{
                                height: 32, padding: '0 16px', borderRadius: 8,
                                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                background: `rgba(${c.nav === 'add' ? '240,180,41' : '255,231,174'},0.7)`,
                                border: `1px solid ${c.accent}`,
                                color: c.color, fontFamily: FSANS,
                            }}
                        >
                            {c.label}
                        </button>
                    </GlassCard>
                ))}
            </div>

            {/* Level Guide */}
            <GlassCard style={{ padding: '1.4rem', marginBottom: '1rem' }}>
                <SectionLabel>Mapping Level Guide</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem' }}>
                    {LEVEL_CFG.slice().reverse().map((cfg, idx) => {
                        const lv = 3 - idx;
                        return (
                            <div key={lv} style={{
                                background: cfg.bg, border: `1px solid ${cfg.border}`,
                                borderRadius: 10, padding: '1rem',
                            }}>
                                <div style={{ fontSize: 26, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{lv}</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, marginTop: 5 }}>{cfg.name}</div>
                                <div style={{ fontSize: 10, color: cfg.color, opacity: 0.6, marginTop: 4, lineHeight: 1.4 }}>
                                    {lv === 3 && 'Direct & significant contribution to PO'}
                                    {lv === 2 && 'Indirect but meaningful correlation to PO'}
                                    {lv === 1 && 'Marginally related to the PO'}
                                    {lv === 0 && 'No detectable keyword correlation'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>

            {/* Formula card */}
            <GlassCard style={{ padding: '1.4rem' }}>
                <SectionLabel>Scoring Formula</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,250,232,0.94)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '1rem' }}>
                        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: C.indigo, fontWeight: 700, marginBottom: 8 }}>
                            Score = Σ(aᵢ / bᵢ) × 3
                        </div>
                        <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.7 }}>
                            <span style={{ color: C.blueLt }}>aᵢ</span> = matched keywords between CO and PO<br />
                            <span style={{ color: C.blueLt }}>bᵢ</span> = total keywords in that PO
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255,250,232,0.94)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '1rem' }}>
                        <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.9 }}>
                            <span style={{ color: C.green, fontWeight: 700 }}>Score ≥ 2.5</span> → Level 3 (Strong)<br />
                            <span style={{ color: C.amber, fontWeight: 700 }}>Score ≥ 1.5</span> → Level 2 (Moderate)<br />
                            <span style={{ color: C.red,   fontWeight: 700 }}>Score ≥ 0.5</span> → Level 1 (Weak)<br />
                            <span style={{ color: C.textDim, fontWeight: 700 }}>Score &lt; 0.5</span> → Level 0 (None)
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
