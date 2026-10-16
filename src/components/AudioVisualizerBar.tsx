import React, { useEffect, useState } from 'react';
import { loveSoundEngine } from '../audio/loveSynth';

export const AudioVisualizerBar: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [frequencies, setFrequencies] = useState<number[]>([15, 25, 40, 20, 30, 45, 25, 10]);

  useEffect(() => {
    if (!isPlaying) {
      setFrequencies([4, 4, 4, 4, 4, 4, 4, 4]);
      return;
    }

    let animId: number;
    const update = () => {
      const data = loveSoundEngine.getAudioFrequencyData();
      if (data && data.length >= 8) {
        // Sample 8 frequency buckets
        const step = Math.floor(data.length / 8);
        const sampled = [
          Math.max(data[0 * step] / 8, 4),
          Math.max(data[1 * step] / 7, 4),
          Math.max(data[2 * step] / 6, 4),
          Math.max(data[3 * step] / 6, 4),
          Math.max(data[4 * step] / 7, 4),
          Math.max(data[5 * step] / 8, 4),
          Math.max(data[6 * step] / 9, 4),
          Math.max(data[7 * step] / 10, 4),
        ];
        setFrequencies(sampled);
      }
      animId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-1 h-5 px-2 py-0.5 rounded-lg bg-black/40 border border-rose-950/60">
      {frequencies.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-full transition-all duration-75"
          style={{
            height: `${Math.min(Math.max(h, 3), 20)}px`,
            backgroundColor: isPlaying ? (i % 2 === 0 ? '#f43f5e' : '#fb7185') : '#4c0519',
            boxShadow: isPlaying ? '0 0 6px #f43f5e' : 'none'
          }}
        />
      ))}
    </div>
  );
};
