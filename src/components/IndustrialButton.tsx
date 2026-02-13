// src/components/IndustrialButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Square, Mic, StopCircle } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';

interface IndustrialButtonProps {
    onPress: () => void;
    isRecording: boolean;
    disabled?: boolean;
}

export const IndustrialButton = ({ onPress, isRecording, disabled }: IndustrialButtonProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.container,
                isRecording ? styles.activeContainer : styles.idleContainer,
                disabled && styles.disabledContainer
            ]}
        >
            {/* Decorative corners for that "Sci-Fi HUD" look */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <View style={styles.content}>
                {isRecording ? (
                    <Square color={COLORS.BACKGROUND} size={32} fill={COLORS.BACKGROUND} />
                ) : (
                    <Mic color={COLORS.ORANGE} size={32} />
                )}
                <Text style={[
                    styles.label,
                    { color: isRecording ? COLORS.BACKGROUND : COLORS.ORANGE }
                ]}>
                    {isRecording ? 'TERMINATE' : 'INITIATE'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    idleContainer: {
        borderColor: COLORS.ORANGE,
        backgroundColor: 'transparent',
    },
    activeContainer: {
        borderColor: COLORS.ORANGE,
        backgroundColor: COLORS.ORANGE,
    },
    disabledContainer: {
        borderColor: COLORS.TEXT_SECONDARY,
        opacity: 0.5,
    },
    content: {
        alignItems: 'center',
        gap: 10,
    },
    label: {
        fontFamily: FONTS.MONO,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    // Corner decorations
    corner: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderColor: COLORS.ORANGE,
    },
    topLeft: { top: -1, left: -1, borderTopWidth: 4, borderLeftWidth: 4 },
    topRight: { top: -1, right: -1, borderTopWidth: 4, borderRightWidth: 4 },
    bottomLeft: { bottom: -1, left: -1, borderBottomWidth: 4, borderLeftWidth: 4 },
    bottomRight: { bottom: -1, right: -1, borderBottomWidth: 4, borderRightWidth: 4 },
});