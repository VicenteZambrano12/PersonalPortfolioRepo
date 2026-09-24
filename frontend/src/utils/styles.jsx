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
      color: colors.accentAmber,
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
    sectionHeading: {
      color: colors.primaryText,
    },
    card: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      boxShadow: theme === 'light' 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
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
      marginBottom: '1rem',
    },
    cardDescription: {
      fontSize: '0.95rem',
      color: colors.secondaryText,
      lineHeight: '1.5',
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
      backgroundColor: theme === 'light' ? '#F1F5F9' : '#0F172A',
      color: colors.secondaryText,
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      border: `1px solid ${colors.border}`,
    },
    youtubeCard: {
      backgroundColor: colors.surface,
      border: `1px solid ${hexToRgba(colors.accentAmber, 0.35)}`,
    },
    youtubeIconBox: {
      width: '3rem',
      height: '3rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: hexToRgba('#EF4444', 0.1),
      color: '#EF4444',
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
      color: colors.accentAmber,
      marginBottom: '1rem',
    },
    youtubeTagline: {
      color: colors.primaryText,
      borderLeft: `4px solid ${colors.accentAmber}`,
      paddingLeft: '1rem',
    },
    youtubeCta: {
      color: colors.accentAmber,
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
      borderRadius: '12px',
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
    },
    videoFrame: {
      backgroundColor: colors.background,
      border: `1px solid ${colors.border}`,
    },
    playButton: {
      backgroundColor: colors.accentAmber,
      color: colors.background,
      boxShadow: `0 0 20px ${hexToRgba(colors.accentAmber, 0.35)}`,
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
      backgroundColor: colors.accentAmber,
      color: theme === 'light' ? '#FFFFFF' : '#0F172A',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '1.5rem',
    }
  };
};