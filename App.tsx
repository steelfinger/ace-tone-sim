import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
      onStep: (s) => useSeq.getState().setCurrentStep(s),
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
