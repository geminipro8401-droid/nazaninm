import React, { useState } from 'react';
import { Heart, Sparkles, X, Gift, RefreshCw, BookmarkCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { REASONS_WHY_I_LOVE_YOU } from '../data/romanticData';
import { LoveReason } from '../types';
import { loveSoundEngine } from '../audio/loveSynth';

export const ReasonsJarModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [currentReason, setCurrentReason] = useState<LoveReason>(REASONS_WHY_I_LOVE_YOU[0]);
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([1]);
  const [isOpening, setIsOpening] = useState(false);

  if (!isOpen) return null;

  const pullRandomReason = () => {
    setIsOpening(true);
    loveSoundEngine.playHeartbeat();

    setTimeout(() => {
      // Pick random reason
      const randomIndex = Math.floor(Math.random() * REASONS_WHY_I_LOVE_YOU.length);
      const picked = REASONS_WHY_I_LOVE_YOU[randomIndex];
      setCurrentReason(picked);

      if (!discoveredIds.includes(picked.id)) {
        setDiscoveredIds(prev => [...prev, picked.id]);
      }

      setIsOpening(false);
      loveSoundEngine.playSparkle();
      confetti({
        particleCount: 60,
        spread: 70,
        colors: ['#ff4d6d', '#ff758f', '#c9184a']
      });
    }, 400);
  };

  const toPersianNum = (n: number): string => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => farsiDigits[parseInt(d, 10)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#20071a] via-[#120311] to-[#080108] border border-rose-500/40 rounded-3xl p-6 md:p-8 shadow-2xl text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-black/60 hover:bg-black text-pink-300 hover:text-white border border-rose-950 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Jar Visual Icon */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-rose-600/20 rounded-full blur-xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-900 to-pink-600 border border-rose-400/40 flex items-center justify-center shadow-lg shadow-rose-950">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>شیشه ۱۰۰ دلیل دوست داشتنت</span>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-rose-100 mb-1">
          چرا انقدر عاشقتم نازنینم؟
        </h3>

        <p className="text-xs text-pink-300/70 mb-6">
          روی دکمه کلیک کن تا یک کپسول عشق از شیشه بیرون بکشیم!
        </p>

        {/* Reason Display Card */}
        <div className={`p-6 rounded-2xl bg-[#0c030c] border border-rose-900/60 shadow-inner mb-6 relative transition-all duration-300 ${isOpening ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <div className="flex items-center justify-between text-xs text-rose-400 mb-3 border-b border-rose-950/80 pb-2">
            <span className="font-bold">دلیل شماره {toPersianNum(currentReason.id)} از ۱۰۰</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-pink-300 text-[11px] border border-rose-900">
              #{currentReason.tag}
            </span>
          </div>

          <p className="text-base md:text-lg font-bold text-pink-100 leading-relaxed py-2">
            « {currentReason.text} »
          </p>

          <div className="flex justify-center items-center gap-1 text-xs text-pink-400/60 mt-3 pt-2 border-t border-rose-950/50">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>از اعماق وجودم برای یکی یدونم</span>
          </div>
        </div>

        {/* Discovery Progress */}
        <div className="flex items-center justify-between text-xs text-pink-300/60 mb-6 px-2">
          <span>کپسول‌های کشف شده:</span>
          <span className="font-bold text-rose-400">
            {toPersianNum(discoveredIds.length)} از ۱۰۰ دلیل
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={pullRandomReason}
          disabled={isOpening}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 cursor-pointer active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isOpening ? 'animate-spin' : ''}`} />
          <span>یک کپسول عاشقانه دیگر بردار ✨</span>
        </button>
      </div>
    </div>
  );
};
