import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';
import { getColors, typography, spacing, borderRadius, shadows } from '../../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, tertiary, danger
    size = 'medium', // small, medium, large
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const { theme } = useTheme();
    const colors = getColors(theme);

    const getButtonStyle = () => {
        const baseStyle = {
            borderRadius: borderRadius.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        };

        // Size styles
        const sizeStyles = {
            small: {
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.base,
            },
            medium: {
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
            },
            large: {
                paddingVertical: spacing.base,
                paddingHorizontal: spacing.xl,
            },
        };

        // Variant styles
        const variantStyles = {
            primary: {
                backgroundColor: disabled ? colors.textTertiary : colors.primary,
                ...shadows.sm,
            },
            secondary: {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: disabled ? colors.textTertiary : colors.primary,
            },
            tertiary: {
                backgroundColor: 'transparent',
            },
            danger: {
                backgroundColor: disabled ? colors.textTertiary : colors.danger,
                ...shadows.sm,
            },
        };

        return [baseStyle, sizeStyles[size], variantStyles[variant]];
    };

    const getTextStyle = () => {
        const baseTextStyle = {
            ...typography.styles.bodySemibold,
        };

        const variantTextStyles = {
            primary: {
                color: colors.textInverse,
            },
            secondary: {
                color: disabled ? colors.textTertiary : colors.primary,
            },
            tertiary: {
                color: disabled ? colors.textTertiary : colors.primary,
            },
            danger: {
                color: colors.textInverse,
            },
        };

        return [baseTextStyle, variantTextStyles[variant]];
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[...getButtonStyle(), style]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'secondary' || variant === 'tertiary' ? colors.primary : colors.textInverse}
                    size="small"
                />
            ) : (
                <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;
