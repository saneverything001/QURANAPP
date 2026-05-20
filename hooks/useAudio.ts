import { useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

export interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  waveformData: number[];
  error: string | null;
  currentQueueIndex: number;
  queueLength: number;
}

export function useAudio() {
  const [state, setState] = useState<AudioState>({
    isRecording: false,
    isPlaying: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    waveformData: Array(30).fill(0.1),
    error: null,
    currentQueueIndex: 0,
    queueLength: 0,
  });

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const stopRecordingResolver = useRef<((blob: Blob | null) => void) | null>(null);
  const waveformInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioQueue = useRef<string[]>([]);
  const onQueueComplete = useRef<(() => void) | null>(null);

  const startRecording = useCallback(async () => {
    if (Platform.OS !== 'web') {
      setState((s) => ({ ...s, error: 'Recording available on web only in preview mode' }));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setState((s) => ({ ...s, audioBlob: blob, audioUrl: url, isRecording: false, waveformData: Array(30).fill(0.1) }));
        stopRecordingResolver.current?.(blob);
        stopRecordingResolver.current = null;
        stream.getTracks().forEach((t) => t.stop());
        if (waveformInterval.current) clearInterval(waveformInterval.current);
        if (durationInterval.current) clearInterval(durationInterval.current);
      };

      mediaRecorder.current.start(100);

      waveformInterval.current = setInterval(() => {
        setState((s) => ({
          ...s,
          waveformData: Array(30).fill(0).map(() => 0.1 + Math.random() * 0.9),
        }));
      }, 100);

      let sec = 0;
      durationInterval.current = setInterval(() => {
        sec++;
        setState((s) => ({ ...s, duration: sec }));
      }, 1000);

      setState((s) => ({ ...s, isRecording: true, duration: 0, audioBlob: null, audioUrl: null, error: null }));
    } catch (err) {
      setState((s) => ({ ...s, error: 'Microphone access denied' }));
    }
  }, [state.audioBlob]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    if (!mediaRecorder.current || mediaRecorder.current.state === 'inactive') {
      return Promise.resolve(state.audioBlob);
    }
    return new Promise((resolve) => {
      stopRecordingResolver.current = resolve;
      mediaRecorder.current?.stop();
    });
  }, [state.audioBlob]);

  const playAudio = useCallback((url?: string) => {
    const src = url ?? state.audioUrl;
    if (!src) return;
    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current = null;
    }
    const audio = new Audio(src);
    audioElement.current = audio;
    audio.onended = () => {
      audioElement.current = null;
      setState((s) => ({ ...s, isPlaying: false }));
    };
    audio.onerror = () => {
      setState((s) => ({ ...s, error: 'Failed to load audio', isPlaying: false }));
    };
    audio.play().catch(() => {
      setState((s) => ({ ...s, error: 'Failed to play audio', isPlaying: false }));
    });
    setState((s) => ({ ...s, isPlaying: true }));
  }, [state.audioUrl]);

  const playQueue = useCallback((urls: string[], onComplete?: () => void, onTrackStart?: (index: number) => void) => {
    if (urls.length === 0) return;
    
    audioQueue.current = urls;
    onQueueComplete.current = onComplete || null;
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= urls.length) {
        setState((s) => ({ ...s, isPlaying: false, currentQueueIndex: 0, queueLength: 0 }));
        onQueueComplete.current?.();
        return;
      }

      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current = null;
      }

      setState((s) => ({ ...s, currentQueueIndex: currentIndex + 1 }));
      onTrackStart?.(currentIndex);
      const audio = new Audio(urls[currentIndex]);
      audioElement.current = audio;

      audio.onended = () => {
        currentIndex++;
        playNext();
      };

      audio.onerror = () => {
        setState((s) => ({ ...s, error: 'Failed to load audio in queue' }));
      };

      audio.play().catch(() => {
        setState((s) => ({ ...s, error: 'Failed to play queue audio' }));
      });
    };

    setState((s) => ({ ...s, isPlaying: true, currentQueueIndex: 0, queueLength: urls.length }));
    playNext();
  }, []);

  const stopAudio = useCallback(() => {
    audioElement.current?.pause();
    audioElement.current = null;
    audioQueue.current = [];
    setState((s) => ({ ...s, isPlaying: false, currentQueueIndex: 0, queueLength: 0 }));
  }, []);

  const reset = useCallback(() => {
    stopAudio();
    setState({ isRecording: false, isPlaying: false, duration: 0, audioBlob: null, audioUrl: null, waveformData: Array(30).fill(0.1), error: null, currentQueueIndex: 0, queueLength: 0 });
  }, [stopAudio]);

  return { ...state, startRecording, stopRecording, playAudio, playQueue, stopAudio, reset };
}
