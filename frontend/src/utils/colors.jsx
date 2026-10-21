export const brandPalettes = {
  dark: {
    background: '#050B24',
    surface: '#101C3D',
    primaryText: '#F1F7FF',
    secondaryText: '#B0BFDB',
    border: '#34466E',
    accentCyan: '#55EAF2',
    accentBlue: '#80B4FF',
    accentViolet: '#C4A3FF',
    onAccent: '#050B24',
  },
  light: {
    background: '#F3F7FF',
    surface: '#FFFFFF',
    primaryText: '#101C3D',
    secondaryText: '#506184',
    border: '#CCD7ED',
    accentCyan: '#007681',
    accentBlue: '#2956C7',
    accentViolet: '#7040C5',
    onAccent: '#FFFFFF',
  }
};

// Converts a "#RRGGBB" color into an "rgba()" string for use in dynamic shadows/glows.
export function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}