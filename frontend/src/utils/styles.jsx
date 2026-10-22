import { brandPalettes, hexToRgba } from './colors';

export const getStyles = (theme = 'dark') => {
  const colors = brandPalettes[theme];

  return {
    siteHeader: {
      backgroundColor: hexToRgba(colors.background, 0.9),
      borderBottom: `1px solid ${colors.border}`,
    },
    siteHeaderTitle: {
      color: colors.primaryText,
    },
    siteHeaderSubtitle: {
      color: colors.accentCyan,
    },
    socialIcon: {
      color: colors.secondaryText,
    },
    themeToggle: {
      backgroundColor: colors.surface,
      color: colors.accentViolet,
      border: `1px solid ${colors.border}`,
    },
    languageSwitcher: {
      backgroundColor: colors.surface,
      color: colors.secondaryText,
      border: `1px solid ${colors.border}`,
    },
    siteFooter: {
      backgroundColor: colors.background,
      color: colors.secondaryText,
      borderTop: `1px solid ${colors.border}`,
    },
    pageContainer: {
      backgroundColor: colors.background,
      color: colors.primaryText,
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    header: {
      marginBottom: '2.5rem',
      paddingBottom: '1.5rem',
      borderBottom: `1px solid ${colors.border}`,
    },
    hero: {
      background: `radial-gradient(ellipse at top right, ${hexToRgba(colors.accentCyan, 0.13)}, transparent 65%), ${colors.surface}`,
      border: `1px solid ${colors.border}`,
    },
    sectionHeading: {
      color: colors.primaryText,
    },
    card: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '20px',
      padding: 'clamp(1.25rem, 3vw, 2rem)',
      cursor: 'pointer',
      boxShadow: theme === 'light' 
        ? '0 8px 30px -12px rgba(16, 28, 61, 0.12)'
        : '0 8px 30px -12px rgba(0, 0, 0, 0.45)',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: colors.primaryText,
      marginBottom: '0.25rem',
    },
    cardSubtitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: colors.accentCyan,
      marginBottom: '0',
    },
    cardDescription: {
      fontSize: '0.95rem',
      color: colors.secondaryText,
      lineHeight: '1.75',
      marginBottom: '1.5rem',
    },
    iconBox: {
      width: '3rem',
      height: '3rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: hexToRgba(colors.accentCyan, theme === 'light' ? 0.12 : 0.15),
      color: colors.accentCyan,
      flexShrink: 0,
    },
    tagContainer: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    tag: {
      backgroundColor: colors.background,
      color: colors.secondaryText,
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      border: `1px solid ${colors.border}`,
    },
    youtubeCard: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      backgroundImage: `linear-gradient(135deg, ${hexToRgba(colors.accentViolet, 0.08)}, transparent 70%)`,
      borderRadius: '20px',
    },
    youtubeIconBox: {
      width: '3rem',
      height: '3rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: hexToRgba(colors.accentViolet, 0.12),
      color: colors.accentViolet,
      flexShrink: 0,
    },
    youtubeTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: colors.primaryText,
      marginBottom: '0.25rem',
    },
    youtubeSubtitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: colors.accentViolet,
      marginBottom: '1rem',
    },
    youtubeTagline: {
      color: colors.primaryText,
      borderLeft: `3px solid ${colors.accentViolet}`,
      paddingLeft: '1rem',
    },
    youtubeCta: {
      color: colors.accentViolet,
      fontWeight: '600',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: hexToRgba(brandPalettes.dark.background, 0.75),
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50,
    },
    modalContent: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '20px',
      position: 'relative',
    },
    modalHeader: {
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
    },
    modalBody: {
      backgroundColor: theme === 'light' ? colors.background : hexToRgba(colors.background, 0.5),
    },
    closeButton: {
      backgroundColor: colors.background,
      color: colors.secondaryText,
      border: `1px solid ${colors.border}`,
      minWidth: '44px',
      minHeight: '44px',
    },
    videoFrame: {
      backgroundColor: colors.background,
      border: `1px solid ${colors.border}`,
    },
    playButton: {
      backgroundColor: colors.accentViolet,
      color: colors.onAccent,
      boxShadow: `0 0 20px ${hexToRgba(colors.accentViolet, 0.2)}`,
    },
    videoBadge: {
      backgroundColor: hexToRgba(colors.background, 0.8),
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },
    panel: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
    },
    panelHeading: {
      color: colors.primaryText,
      borderBottom: `1px solid ${colors.border}`,
    },
    sectionIcon: {
      color: colors.accentCyan,
    },
    modalTag: {
      backgroundColor: colors.background,
      color: colors.accentCyan,
      border: `1px solid ${hexToRgba(colors.accentCyan, 0.2)}`,
    },
    buttonPrimary: {
      backgroundColor: colors.accentViolet,
      color: colors.onAccent,
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '1.5rem',
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: colors.accentCyan,
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      border: `1px solid ${hexToRgba(colors.accentCyan, 0.4)}`,
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      textDecoration: 'none',
    }
  };
};