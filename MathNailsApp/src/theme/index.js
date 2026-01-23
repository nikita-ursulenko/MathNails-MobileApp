// Export all theme tokens
export { colors, getColors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';
export { shadows } from './shadows';

// Create a complete theme object
export const createTheme = (mode = 'light') => {
    const { colors: themeColors, getColors } = require('./colors');
    const { typography } = require('./typography');
    const { spacing, borderRadius } = require('./spacing');
    const { shadows } = require('./shadows');

    return {
        colors: getColors(mode),
        typography,
        spacing,
        borderRadius,
        shadows,
        mode,
    };
};
