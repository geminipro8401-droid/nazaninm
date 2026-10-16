/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Sparkles, Gift, HeartHandshake, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CountdownSection } from './components/CountdownSection';
import { DualTimezoneWidget } from './components/DualTimezoneWidget';
import { ConstellationSection } from './components/ConstellationSection';
import { LettersSection } from './components/LettersSection';
import { PoetrySection } from './components/PoetrySection';
import { ReasonsJarModal } from './components/ReasonsJarModal';
import { VirtualHugModal } from './components/VirtualHugModal';
import { FloatingPetalsCanvas } from './components/FloatingPetalsCanvas';
import { CustomCursor } from './components/CustomCursor';
import { loveSoundEngine } from './audio/loveSynth';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isReasonsJarOpen, setIsReasonsJarOpen] = useState<boolean>(false);
  const [isVirtualHugOpen, setIsVirtualHugOpen] = useState<boolean>(false);

  const handleEnterWorld = () => {
    setHasEntered(true);
    const musicStarted = loveSoundEngine.toggleMusic();
    setIsMusicPlaying(musicStarted);

    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff2a6d', '#ff758c', '#ffffff', '#e11d48']
    });
  };

  const handleToggleMusic = () => {
    const newState = loveSoundEngine.toggleMusic();
    setIsMusicPlaying(newState);
  };

  return (
    <div className="min-h-screen bg-[#040106] text-pink-50 relative selection:bg-rose-500 selection:text-white font-sans overflow-x-hidden">
      {/* Luxury Custom Precision Cursor */}
      <CustomCursor />

      {/* Background Floating Ambient Petals */}
      <FloatingPetalsCanvas />

      {/* INTRO GATEWAY (Shown before entering for luxury reveal) */}
      {!hasEntered ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-radial from-[#1e071c] via-[#0d030f] to-[#040106] select-none">
          <div className="relative w-full max-w-lg text-center p-8 md:p-12 rounded-3xl bg-black/60 border border-luxury-glow box-glow-luxury backdrop-blur-2xl">
            {/* Glowing Heart Ring */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-rose-600/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-950 animate-heartbeat-luxury">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            </div>

            <div className="inline-block px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-4 shadow-md">
              ✨ دروازه ورود به دنیای اختصاصی ما
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-red-400 mb-4">
              سلام نازنین من... ❤️
            </h1>

            <p className="text-sm md:text-base text-pink-200/80 leading-relaxed mb-8">
              کیوتک یکی یدونم، این گوشه دنج از اینترنت فقط و فقط برای تو طراحی شده؛ پر از نامه‌های دلتنگی، شعرها، انیمیشن‌های سه‌بعدی و شمارنده دقیق تا لحظه‌ای که دوباره در آغوش منی.
            </p>

            <button
              onClick={handleEnterWorld}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-base shadow-2xl shadow-rose-950/80 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>ورود به دنیای قشنگمون، کیوتک من ✨</span>
            </button>

            <p className="text-[11px] text-pink-300/50 mt-4">
              هم‌زمان با ورود، نوای پیانو و ملودی اختصاصی قلبمان نواخته خواهد شد.
            </p>
          </div>
        </div>
      ) : null}

      {/* Main Website Structure */}
      <Navbar
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenReasonsJar={() => setIsReasonsJarOpen(true)}
        onOpenVirtualHug={() => setIsVirtualHugOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-12">
        {/* HERO TITLE SECTION */}
        <section className="text-center max-w-3xl mx-auto pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-4 shadow-md">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>تقدیم به زیباترین دختر این جهان</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-300 to-red-400 tracking-tight mb-4">
            نازنین | کیوتک، یکی یدونم ❤️
          </h1>

          <p className="text-sm md:text-lg text-pink-200/80 leading-relaxed">
            فاصله‌ها فقط عددند وقتی روحم با هر نفست پیوند خورده. اینجا قلمرو ابدی عشق ماست که در شب‌های دلتنگی روشن می‌ماند.
          </p>
        </section>

        {/* 3D WEBGL INTERACTIVE EXPERIENCE */}
        <section className="relative">
          <ThreeCanvas
            onHeartbeatTrigger={() => {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.5 },
                colors: ['#ff2a6d', '#ff758c', '#ffffff']
              });
            }}
          />
        </section>

        {/* DUAL TIMEZONE & DISTANCE TELEMETRY */}
        <DualTimezoneWidget />

        {/* 2-WEEK REUNION CHRONOMETER SECTION */}
        <CountdownSection />

        {/* CONSTELLATION OF MEMORIES (New Luxury Section) */}
        <ConstellationSection />

        {/* INTERACTIVE 3D LOVE LETTERS SECTION */}
        <LettersSection />

        {/* PERSIAN POETRY & LOVE DIVINATION SECTION */}
        <PoetrySection />

        {/* ROMANTIC PROMISES & EMOTIONAL BANNER */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#20081c] via-[#140413] to-[#20081c] border border-luxury-glow box-glow-luxury shadow-2xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-rose-900/60 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-300 mb-4 shadow-lg shadow-rose-950">
              <HeartHandshake className="w-7 h-7" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-rose-100 mb-3">
              فاصله بین ما، حریف عمق عشقمون نیست
            </h3>

            <p className="text-sm md:text-base text-pink-200/80 leading-relaxed mb-6">
              «کیوتک قشنگم، روزی که دوباره دستاتو بگیرم و سرمو بذارم روی شونت، به تمام این روزهای سخت دلتنگی لبخند می‌زنیم و می‌گوییم: دیدی با عشق تونستیم؟»
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setIsVirtualHugOpen(true);
                  loveSoundEngine.playHoverChime();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-xl shadow-rose-950 cursor-pointer active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>همین الان بغلم کن (آغوش مجازی)</span>
              </button>

              <button
                onClick={() => {
                  setIsReasonsJarOpen(true);
                  loveSoundEngine.playHoverChime();
                }}
                className="px-6 py-3 rounded-2xl bg-black/60 hover:bg-black border border-rose-900/60 text-pink-200 hover:text-white font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4 text-pink-400" />
                <span>شیشه ۱۰۰ دلیل دوست داشتنت</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-rose-950/70 py-10 px-4 text-center text-xs text-pink-300/60">
        <div className="flex items-center justify-center gap-2 mb-2 text-rose-400 font-bold">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>طراحی شده با تمام عشق جهان برای نازنین (کیوتک، یکی یدونم)</span>
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
        </div>
        <p className="text-pink-300/40">
          فاصله موقتی است، ولی عشقی که به تو دارم تا ابد ابد ماندگار خواهد بود...
        </p>
      </footer>

      {/* MODALS */}
      <ReasonsJarModal
        isOpen={isReasonsJarOpen}
        onClose={() => setIsReasonsJarOpen(false)}
      />

      <VirtualHugModal
        isOpen={isVirtualHugOpen}
        onClose={() => setIsVirtualHugOpen(false)}
      />
    </div>
  );
}
