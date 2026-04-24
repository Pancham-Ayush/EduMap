export const C = {
    bg:          '#fff9eb',
    surface:     '#fff5da',
    card:        '#fff0c2',
    input:       '#fffdf5',
    border:      '#e6cf8b',
    borderHi:    '#d8b75c',
    borderGlow:  '#f2c94c',
    blue:        '#d4a017',
    blueLt:      '#f0b429',
    blueDk:      '#a77900',
    indigo:      '#c78f1e',
    teal:        '#d9a441',
    text:        '#4f3510',
    textSec:     '#8a6731',
    textDim:     '#b6914d',
    green:       '#7a9a2f',
    amber:       '#d4a017',
    red:         '#c56a2d',
};

export const F = "'IBM Plex Mono', 'Fira Code', 'Courier New', monospace";
export const FSANS = "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif";

export const GLASS_CARD = {
    background: `linear-gradient(145deg, rgba(255,248,224,0.98), rgba(255,239,196,0.96))`,
    border: `1px solid #e6cf8b`,
    borderTop: `1px solid #f1d782`,
    borderLeft: `1px solid #edd08a`,
    borderRadius: 14,
    position: 'relative',
    overflow: 'hidden',
};

export const LEVEL_CFG = [
    { bg: '#fffdf5', color: '#b6914d', border: '#e6cf8b',              label: '–', name: 'None'     },
    { bg: '#fff1d6', color: '#c56a2d', border: 'rgba(197,106,45,0.35)', label: '1', name: 'Weak'     },
    { bg: '#ffe7ae', color: '#d4a017', border: 'rgba(212,160,23,0.35)', label: '2', name: 'Moderate' },
    { bg: '#f5e08a', color: '#7a9a2f', border: 'rgba(122,154,47,0.35)', label: '3', name: 'Strong'   },
];

export function inputStyle(extra = {}) {
    return {
        background: '#fffdf5',
        border: `1px solid #e6cf8b`,
        borderRadius: 8,
        color: '#4f3510',
        padding: '0 12px',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: FSANS,
        outline: 'none',
        transition: 'border .15s',
        ...extra,
    };
}

export function btnStyle(variant = 'blue', extra = {}) {
    const variants = {
        blue:   { background: 'rgba(240,180,41,0.18)',  border: `1px solid rgba(212,160,23,0.45)`,  color: '#a77900' },
        indigo: { background: 'rgba(255,231,174,0.95)', border: `1px solid rgba(199,143,30,0.45)`,  color: '#8f6514' },
        ghost:  { background: 'transparent',            border: `1px solid #d8b75c`,                 color: '#8a6731' },
    };
    return {
        height: 32,
        padding: '0 16px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: FSANS,
        transition: 'all .15s',
        ...variants[variant],
        ...extra,
    };
}
