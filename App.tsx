import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// 1. Start Recording
async function startRecording() {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);
  } catch (err) {
    console.error('Failed to start recording', err);
  }
}

// 2. Stop and Send to n8n
async function stopAndSend() {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI(); // The local path to your audio file

  // Upload to your n8n Webhook
  const response = await FileSystem.uploadAsync('YOUR_N8N_WEBHOOK_URL', uri, {
    fieldName: 'data', // This MUST match the Binary Property name in your n8n Webhook node
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
  });

  console.log('Server Response:', response.body);
}