import { GLASS_CARD, C, FSANS } from '../styles';

export function Shimmer() {
    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(240,180,41,0.65), rgba(255,231,174,0.9), transparent)',
            pointerEvents: 'none',
        }} />
    );
}

export function GlassCard({ children, style = {} }) {
    return (
        <div style={{ ...GLASS_CARD, ...style }}>
            <Shimmer />
            {children}
        </div>
    );
}

export function SectionLabel({ children }) {
    return (
        <div style={{
            fontSize: 9, fontWeight: 700, color: C.textDim,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            marginBottom: '0.875rem', fontFamily: FSANS,
        }}>
            {children}
        </div>
    );
}

export function PageTitle({ title, sub }) {
    return (
        <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
                fontSize: 22, fontWeight: 800,
                background: `linear-gradient(90deg, #d4a017, #f0b429, #c78f1e)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontFamily: FSANS,
            }}>
                {title}
            </div>
            {sub && (
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, fontStyle: 'italic', fontFamily: FSANS }}>
                    {sub}
                </div>
            )}
        </div>
    );
}
