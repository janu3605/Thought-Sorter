// src/components/StatusHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface StatusHeaderProps {
    status: 'IDLE' | 'RECORDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
}

export const StatusHeader = ({ status }: StatusHeaderProps) => {
    const getStatusColor = () => {
        switch (status) {
            case 'RECORDING': return COLORS.ORANGE;
            case 'SUCCESS': return COLORS.SUCCESS;
            case 'ERROR': return COLORS.ERROR;
            default: return COLORS.TEXT_SECONDARY;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Text style={styles.appTitle}>THOUGHT_SORTER v1.0</Text>
                <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
            </View>
            <View style={styles.divider} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
                SYSTEM::{status}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 40,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    appTitle: {
        fontFamily: FONTS.MONO,
        color: COLORS.TEXT_SECONDARY,
        fontSize: 12,
        letterSpacing: 2,
    },
    indicator: {
        width: 8,
        height: 8,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.BORDER,
        width: '100%',
        marginBottom: 8,
    },
    statusText: {
        fontFamily: FONTS.MONO,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});