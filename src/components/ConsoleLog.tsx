// src/components/ConsoleLog.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface LogEntry {
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'error';
}

export const ConsoleLog = ({ logs }: { logs: LogEntry[] }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);

    return (
        <View style={styles.wrapper}>
            <Text style={styles.header}>SYSTEM_LOG</Text>
            <ScrollView
                ref={scrollViewRef}
                style={styles.container}
                contentContainerStyle={styles.content}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {logs.map((log) => {
                    // @ts-ignore - View key prop compatibility
                    return <View key={log.id}>
                        <Text style={styles.logText}>
                            <Text style={styles.timestamp}>[{log.timestamp}]</Text>{' '}
                            <Text style={{
                                color: log.type === 'error' ? COLORS.ERROR :
                                    log.type === 'success' ? COLORS.SUCCESS : COLORS.TEXT_PRIMARY
                            }}>
                                {'>'} {log.message}
                            </Text>
                        </Text>
                    </View>;
                })}
                {logs.length === 0 && <Text style={styles.cursor}>_</Text>}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        marginTop: 40,
    },
    header: {
        fontFamily: FONTS.MONO,
        color: COLORS.TEXT_SECONDARY,
        fontSize: 10,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        paddingBottom: 2,
    },
    container: {
        backgroundColor: COLORS.SURFACE,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        flex: 1,
    },
    content: {
        padding: 10,
    },
    logText: {
        fontFamily: FONTS.MONO,
        fontSize: 12,
        marginBottom: 4,
        color: COLORS.TEXT_PRIMARY,
    },
    timestamp: {
        color: COLORS.TEXT_SECONDARY,
    },
    cursor: {
        color: COLORS.ORANGE,
        fontFamily: FONTS.MONO,
        fontSize: 12,
    },
});
