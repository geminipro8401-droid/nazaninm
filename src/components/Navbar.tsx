import React from 'react';
import { Heart, Music, VolumeX, Gift, Sparkles } from 'lucide-react';
import { AudioVisualizerBar } from './AudioVisualizerBar';
import { loveSoundEngine } from '../audio/loveSynth';

interface NavbarProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenReasonsJar: () => void;
  onOpenVirtualHug: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMusicPlaying,
  onToggleMusic,
  onOpenReasonsJar,
  onOpenVirtualHug
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050107]/85 backdrop-blur-xl border-b border-rose-950/70 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Names */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-950 border border-rose-300/30">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="text-sm md:text-base font-black text-pink-100 flex items-center gap-1.5">
              <span>نازنین</span>
              <span className="text-rose-400 font-medium text-xs">• کیوتک، یکی یدونم</span>
            </div>
            <div className="text-[10px] text-pink-300/60 hidden sm:block">
              عشق ابدی ما از راه دور ❤️
            </div>
          </div>
        </div>

        {/* Audio Equalizer & Quick Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live Audio Visualizer Equalizer */}
          <div className="hidden sm:block">
            <AudioVisualizerBar isPlaying={isMusicPlaying} />
          </div>

          {/* Virtual Hug Button */}
          <button
            onClick={() => {
              onOpenVirtualHug();
              loveSoundEngine.playHoverChime();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="hidden sm:inline">آغوش مجازی</span>
          </button>

          {/* 100 Reasons Jar Button */}
          <button
            onClick={() => {
              onOpenReasonsJar();
              loveSoundEngine.playHoverChime();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-pink-950/70 hover:bg-pink-900 border border-pink-500/30 text-pink-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Gift className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">شیشه ۱۰۰ دلیل</span>
          </button>

          {/* Music Box Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isMusicPlaying
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-400 shadow-md shadow-rose-950'
                : 'bg-black/60 text-pink-300/70 hover:text-white border-rose-950'
            }`}
            title={isMusicPlaying ? 'قطع موزیک باکس' : 'پخش ملودی عاشقانه'}
          >
            {isMusicPlaying ? (
              <>
                <Music className="w-4 h-4 animate-pulse" />
                <span className="hidden md:inline">موزیک باکس</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden md:inline">ملودی عشق</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
