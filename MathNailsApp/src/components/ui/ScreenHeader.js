import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../../context/ThemeProvider';
import { getColors, typography, spacing } from '../../theme';

const ScreenHeader = ({ title, subtitle, rightElement }) => {
    const { theme } = useTheme();
    const colors = getColors(theme);

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                    {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.base,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...typography.styles.h1,
    },
    subtitle: {
        ...typography.styles.caption,
        marginTop: spacing.xs,
    },
    rightElement: {
        marginLeft: spacing.base,
    },
});

export default ScreenHeader;
