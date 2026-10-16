import React, { useState, useRef, useEffect } from 'react';
import { Heart, X, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveSoundEngine } from '../audio/loveSynth';
import { VIRTUAL_HUG_QUOTES } from '../data/romanticData';

export const VirtualHugModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [hugProgress, setHugProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHugProgress(0);
      setIsHolding(false);
      setIsCompleted(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startHolding = () => {
    if (isCompleted) return;
    setIsHolding(true);
    loveSoundEngine.playHeartbeat();

    timerRef.current = window.setInterval(() => {
      setHugProgress(prev => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsHolding(false);
          setIsCompleted(true);
          loveSoundEngine.playSparkle();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#ff1493', '#ff69b4', '#e11d48', '#ffffff']
          });
          return 100;
        }

        // Pulse heartbeat every ~20%
        if (prev % 20 === 0) {
          loveSoundEngine.playHeartbeat();
          if (navigator.vibrate) {
            navigator.vibrate([80, 40, 80]);
          }
        }

        return prev + 2;
      });
    }, 60);
  };

  const stopHolding = () => {
    if (isCompleted) return;
    setIsHolding(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetHug = () => {
    setHugProgress(0);
    setIsCompleted(false);
    setCurrentQuoteIndex((prev) => (prev + 1) % VIRTUAL_HUG_QUOTES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Full screen warm embrace glow when holding */}
      {isHolding && (
        <div className="fixed inset-0 pointer-events-none bg-radial from-rose-600/30 via-pink-600/10 to-transparent animate-pulse" />
      )}

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#25081f] via-[#150415] to-[#090109] border border-rose-500/40 rounded-3xl p-6 md:p-8 shadow-2xl text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-black/60 hover:bg-black text-pink-300 hover:text-white border border-rose-950 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>آغوش مجازی و لمس دلتنگی</span>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-pink-100 mb-1">
          بغل گرم برای کیوتک من
        </h3>

        <p className="text-xs text-pink-300/70 mb-6">
          دکمه زیر را فشار بده و نگه دار تا گرمای آغوشم را از راه دور حس کنی...
        </p>

        {/* Central Pulsing Heart Visual */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          {/* Circular progress track */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#2e0821"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#roseGradient)"
              strokeWidth="6"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * hugProgress) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-75"
            />
            <defs>
              <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Interactive Heart Button inside */}
          <div
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            className={`absolute w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 select-none ${
              isCompleted
                ? 'bg-gradient-to-tr from-rose-600 to-pink-500 shadow-xl shadow-rose-900'
                : isHolding
                ? 'scale-110 bg-gradient-to-tr from-red-600 to-rose-500 shadow-2xl shadow-red-900/80 animate-heartbeat'
                : 'bg-gradient-to-tr from-rose-950 to-red-900 hover:scale-105 border border-rose-500/30'
            }`}
          >
            <Heart
              className={`w-12 h-12 text-white fill-white transition-transform ${
                isHolding ? 'scale-110' : ''
              }`}
            />
          </div>
        </div>

        {/* Progress & Message */}
        <div className="mb-6">
          <div className="text-sm font-bold text-rose-300 mb-2">
            {isCompleted ? (
              <span className="text-green-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                آغوش ۱۰۰٪ محکم شد! بوی موهات حس شد ❤️
              </span>
            ) : isHolding ? (
              <span>در حال در آغوش کشیدنت... {hugProgress}٪</span>
            ) : (
              <span>انگشتت را روی قلب نگه دار</span>
            )}
          </div>

          <p className="text-xs text-pink-200/80 max-w-sm mx-auto leading-relaxed italic p-3 rounded-xl bg-black/40 border border-rose-950">
            « {VIRTUAL_HUG_QUOTES[currentQuoteIndex]} »
          </p>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button
            onClick={resetHug}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg"
          >
            یک بار دیگه بغلم کن!
          </button>
        ) : (
          <div className="text-[11px] text-pink-400/60">
            روی گوشی، انگشتت را روی قلب لمس کن و نگه دار
          </div>
        )}
      </div>
    </div>
  );
};
