import { LogBox } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreLogs(['RecordingNotificationManager is not implemented on iOS']);
import { Panel } from './src/ui/Panel';
import { getAudio } from './src/audio/context';
import { createScheduler } from './src/audio/scheduler';
import { useSeq } from './src/state/sequencer';

export default function App() {
  // Initialise the AudioContext eagerly
  useEffect(() => { getAudio(); }, []);

  // Create the scheduler once in an effect — avoids ref mutation during render
  const schedulerRef = useRef<ReturnType<typeof createScheduler> | null>(null);
  useEffect(() => {
    schedulerRef.current = createScheduler({
      getBpm: () => useSeq.getState().bpm,
      getPattern: () => useSeq.getState().getPattern(),
      onStep: (s, time) => {
        // Defer the visual update to the audio-clock instant the hit actually plays,
        // so anything driven by `currentStep` (e.g. PowerIndicator) stays in sync
        // instead of firing up to LOOKAHEAD ms early.
        const { ctx } = getAudio();
        const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
        setTimeout(() => {
          if (useSeq.getState().running) useSeq.getState().setCurrentStep(s);
        }, delayMs);
      },
    });
    return () => { schedulerRef.current?.stop(); };
  }, []);

  const running = useSeq(s => s.running);
  useEffect(() => {
    if (running) schedulerRef.current!.start();
    else schedulerRef.current!.stop();
  }, [running]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Panel />
    </GestureHandlerRootView>
  );
}
