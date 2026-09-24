export const brandPalettes = {
  dark: {
    background: '#0F172A',     // Trust Navy
    surface: '#1E293B',        // Elevated Navy for cards/modals
    primaryText: '#F8FAFC',    // Demystified White
    secondaryText: '#94A3B8',  // Light Slate
    border: '#334155',         // Dark Slate
    accentCyan: '#06B6D4',     // Cognitive Cyan
    accentAmber: '#F59E0B',    // Clarity Amber
  },
  light: {
    background: '#F8FAFC',     // Demystified White
    surface: '#FFFFFF',        // Pure White for cards/modals
    primaryText: '#0F172A',    // Trust Navy
    secondaryText: '#64748B',  // Pragmatic Slate
    border: '#E2E8F0',         // Light Slate
    accentCyan: '#0891B2',     // Slightly deeper Cyan for text contrast
    accentAmber: '#EA580C',    // Deeper Amber for text contrast
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