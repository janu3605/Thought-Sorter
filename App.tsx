// App.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS } from './src/constants/theme';
import { StatusHeader } from './src/components/StatusHeader';
import { IndustrialButton } from './src/components/IndustrialButton';
import { ConsoleLog } from './src/components/ConsoleLog';

// --- CONFIGURATION ---
const N8N_WEBHOOK_URL = 'https://aureoline-deonna-overpopularly.ngrok-free.dev/webhook/voice-note';

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

      if (!uri) throw new Error('No URI generated');
      addLog(`File captured at: ${uri}`);

      addLog('Initiating upload...');

      let responseBody;

      // 🔀 BRANCH: WEB vs. MOBILE
      if (Platform.OS === 'web') {
        // --- WEB LOGIC ---
        // 1. Fetch the file from the local browser URL
        const response = await fetch(uri);
        const blob = await response.blob();

        // 2. Create a "File" object to attach the filename (Fixes the 3-argument error)
        const file = new File([blob], 'recording.m4a', { type: 'audio/m4a' });

        // 3. Append safely with just 2 arguments
        const formData = new FormData();
        formData.append('data', file);

        // 4. Send to n8n
        const upload = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });

        if (upload.ok) {
          responseBody = await upload.text();
        } else {
          throw new Error(`Server returned ${upload.status}`);
        }

      } else {
        // --- MOBILE LOGIC (Using Expo FileSystem) ---
        const response = await FileSystem.uploadAsync(N8N_WEBHOOK_URL, uri, {
          fieldName: 'data',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        });

        if (response.status >= 200 && response.status < 300) {
          responseBody = response.body;
        } else {
          throw new Error(`Server returned ${response.status}`);
        }
      }

      // Success Handling (Shared)
      addLog('Upload complete. Processing...', 'success');
      if (responseBody) addLog(`Server: ${responseBody}`, 'info');
      setStatus('SUCCESS');

    } catch (err) {
      addLog(`Upload failed: ${err}`, 'error');
      setStatus('ERROR');
    }

    // Reset
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