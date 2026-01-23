// Color palette for light and dark themes
export const colors = {
    light: {
        // Backgrounds
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',

        // Primary colors
        primary: '#6366F1',
        primaryLight: '#818CF8',
        primaryDark: '#4F46E5',

        // Semantic colors
        success: '#22C55E',
        successLight: '#4ADE80',
        warning: '#F59E0B',
        warningLight: '#FCD34D',
        danger: '#EF4444',
        dangerLight: '#F87171',

        // Text colors
        text: '#1E293B',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        textInverse: '#FFFFFF',

        // Border colors
        border: '#F1F5F9',
        borderStrong: '#E2E8F0',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.5)',
    },

    dark: {
        // Backgrounds
        background: '#0F172A',
        surface: '#1E293B',
        surfaceElevated: '#334155',

        // Primary colors
        primary: '#6366F1',
        primaryLight: '#818CF8',
        primaryDark: '#4F46E5',

        // Semantic colors
        success: '#22C55E',
        successLight: '#4ADE80',
        warning: '#F59E0B',
        warningLight: '#FCD34D',
        danger: '#EF4444',
        dangerLight: '#F87171',

        // Text colors
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        textInverse: '#1E293B',

        // Border colors
        border: '#334155',
        borderStrong: '#475569',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.7)',
    },
};

// Helper function to get colors for current theme
export const getColors = (theme) => colors[theme] || colors.light;
