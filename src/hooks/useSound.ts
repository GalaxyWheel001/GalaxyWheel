import { useEffect, useState, useCallback } from 'react';
import { Howl } from 'howler';
import type { SoundManager } from '@/types';

const MUTE_KEY = 'galaxy_wheel_muted';

export function useSound(): SoundManager {
  const [isMuted, setIsMuted] = useState(false);
  const [sounds, setSounds] = useState<{
    spin?: Howl;
    win?: Howl;
  }>({});

  useEffect(() => {
    // Load mute preference
    const stored = localStorage.getItem(MUTE_KEY);
    if (stored) {
      setIsMuted(JSON.parse(stored));
    }

    // Initialize sounds with base64 data or generate programmatically
    const spinSound = new Howl({
      src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAA='], // Placeholder
      volume: 0.5,
      html5: true
    });

    const winSound = new Howl({
      src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAA='], // Placeholder
      volume: 0.7,
      html5: true
    });

    setSounds({ spin: spinSound, win: winSound });

    return () => {
      spinSound.unload();
      winSound.unload();
    };
  }, []);

  const playSpinSound = useCallback(() => {
    if (!isMuted && sounds.spin) {
      sounds.spin.play();
    }
  }, [isMuted, sounds.spin]);

  const playWinSound = useCallback(() => {
    if (!isMuted && sounds.win) {
      sounds.win.play();
    }
  }, [isMuted, sounds.win]);

  const toggleSound = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem(MUTE_KEY, JSON.stringify(newMuted));
  }, [isMuted]);

  return {
    playSpinSound,
    playWinSound,
    toggleSound,
    isMuted
  };
}
