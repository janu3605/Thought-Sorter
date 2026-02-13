// App.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { COLORS } from './src/constants/theme';
import { StatusHeader } from './src/components/StatusHeader';
import { IndustrialButton } from './src/components/IndustrialButton';
import { ConsoleLog } from './src/components/ConsoleLog';

// --- CONFIGURATION ---
const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';

type AppState = 'IDLE' | 'RECORDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';

export default function App() {
  const [status, setStatus] = useState<AppState>('IDLE');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Helper to add logs
  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, {
      id: Math.random().toString(),
      timestamp,
      message,
      type
    }]);
  };

  // 1. Start Recording
  async function startRecording() {
    try {
      addLog('Requesting audio permissions...');
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status !== 'granted') {
        addLog('Permission denied.', 'error');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      addLog('Initializing audio stream...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setStatus('RECORDING');
      addLog('Recording started.', 'success');
    } catch (err) {
      addLog(`Failed to start: ${err}`, 'error');
      setStatus('ERROR');
    }
  }

  // 2. Stop & Upload
  async function stopRecording() {
    if (!recording) return;

    setStatus('UPLOADING');
    addLog('Stopping stream...');

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      addLog(`File captured at: ${uri}`);

      if (!uri) throw new Error('No URI generated');

      addLog('Initiating upload to n8n...');

      // Upload Logic
      const response = await FileSystem.uploadAsync(N8N_WEBHOOK_URL, uri, {
        fieldName: 'data',
        httpMethod: 'POST',
      });

      if (response.status >= 200 && response.status < 300) {
        addLog('Upload complete. Processing...', 'success');
        // Optional: Log the server response if it sends text back
        if (response.body) addLog(`Server: ${response.body}`, 'info');
        setStatus('SUCCESS');
      } else {
        throw new Error(`Server returned ${response.status}`);
      }

    } catch (err) {
      addLog(`Upload failed: ${err}`, 'error');
      setStatus('ERROR');
    }

    // Reset after delay
    setRecording(null);
    setTimeout(() => setStatus('IDLE'), 3000);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
      <View style={styles.container}>

        {/* Header Section */}
        <StatusHeader status={status} />

        {/* Control Section */}
        <View style={styles.centerStage}>
          <IndustrialButton
            isRecording={status === 'RECORDING'}
            onPress={status === 'RECORDING' ? stopRecording : startRecording}
            disabled={status === 'UPLOADING'}
          />
        </View>

        {/* Log Section */}
        <ConsoleLog logs={logs} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});