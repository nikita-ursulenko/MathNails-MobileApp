import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';
import { getColors, spacing, borderRadius, shadows } from '../../theme';

const Card = ({ children, style, elevated = false, noPadding = false }) => {
    const { theme } = useTheme();
    const colors = getColors(theme);

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
                    borderColor: colors.border,
                },
                elevated ? shadows.lg : shadows.md,
                noPadding && styles.noPadding,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
    },
    noPadding: {
        padding: 0,
    },
});

export default Card;
