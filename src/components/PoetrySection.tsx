import React, { useState } from 'react';
import { BookOpen, Sparkles, Feather, Heart, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PersianPoem } from '../types';
import { PERSIAN_POEMS } from '../data/romanticData';
import { loveSoundEngine } from '../audio/loveSynth';

export const PoetrySection: React.FC = () => {
  const [selectedPoem, setSelectedPoem] = useState<PersianPoem>(PERSIAN_POEMS[0]);
  const [isDivinationModalOpen, setIsDivinationModalOpen] = useState(false);
  const [divinationPoem, setDivinationPoem] = useState<PersianPoem | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const takeDivination = () => {
    setIsShuffling(true);
    loveSoundEngine.playHeartbeat();

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PERSIAN_POEMS.length);
      const picked = PERSIAN_POEMS[randomIndex];
      setDivinationPoem(picked);
      setIsShuffling(false);
      setIsDivinationModalOpen(true);
      loveSoundEngine.playSparkle();
      confetti({
        particleCount: 70,
        spread: 80,
        colors: ['#f43f5e', '#ec4899', '#fde047', '#ffffff']
      });
    }, 700);
  };

  return (
    <section id="poetry-section" className="my-16 relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-rose-400" />
          دیوان شعر و نجوای دلتنگی
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-red-400 mb-2">
          شعرهایی برای یکی یدونم
        </h2>
        <p className="text-sm md:text-base text-pink-200/70">
          کلام بزرگانی که زبان حال دلتنگی من برای نازنین را سروده‌اند.
        </p>
      </div>

      {/* Main Feature: Love Divination Banner */}
      <div className="max-w-3xl mx-auto mb-10 p-6 rounded-3xl bg-gradient-to-r from-[#20081a] via-[#150514] to-[#20081a] border border-rose-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-right">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-700 to-pink-600 border border-rose-300/40 flex items-center justify-center shadow-lg shadow-rose-950 shrink-0 mx-auto sm:mx-0">
            <Feather className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-100 mb-1">
              فال عاشقی مخصوص نازنین
            </h3>
            <p className="text-xs text-pink-300/70 leading-relaxed">
              نیت کن، دستتو بذار روی قلبت و یک تفأل به دیوان عاشقی بزن...
            </p>
          </div>
        </div>

        <button
          onClick={takeDivination}
          disabled={isShuffling}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-xl shadow-rose-950/60 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          {isShuffling ? (
            <>
              <Shuffle className="w-4 h-4 animate-spin" />
              <span>در حال تفأل...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>گرفتن فال عاشقی ✨</span>
            </>
          )}
        </button>
      </div>

      {/* Poetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERSIAN_POEMS.map((poem) => (
          <div
            key={poem.id}
            className="group relative rounded-2xl bg-gradient-to-b from-[#180616] to-[#0c030d] border border-rose-900/30 hover:border-rose-500/50 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Poet Badge */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-900 px-3 py-1 rounded-full">
                {poem.poet}
              </span>
              <span className="text-[11px] text-pink-300/60">
                {poem.theme}
              </span>
            </div>

            {/* Verses */}
            <div className="space-y-2.5 my-4 text-center py-4 bg-black/30 rounded-xl border border-rose-950/50">
              {poem.verses.map((verse, vIdx) => (
                <p
                  key={vIdx}
                  className={`text-sm md:text-base font-medium leading-relaxed ${
                    vIdx % 2 === 0 ? 'text-pink-100' : 'text-rose-200'
                  }`}
                >
                  {verse}
                </p>
              ))}
            </div>

            {/* Personal Note For Nazanin */}
            <div className="mt-4 pt-3 border-t border-rose-950 flex items-start gap-2 text-xs text-pink-300/80 leading-relaxed">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
              <span>{poem.noteForNazanin}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divination Modal */}
      {isDivinationModalOpen && divinationPoem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#220a1c] via-[#140412] to-[#0a0208] border border-rose-500/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-pink-500 border border-rose-300/40 mx-auto flex items-center justify-center shadow-lg shadow-rose-950 mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 text-xs font-semibold mb-2">
              نتیجه فال عاشقی برای نازنین
            </div>

            <h3 className="text-xl font-bold text-pink-100 mb-4">
              کلام پر از مهر {divinationPoem.poet}
            </h3>

            {/* Verses */}
            <div className="p-5 rounded-2xl bg-black/50 border border-rose-900/60 space-y-3 mb-6">
              {divinationPoem.verses.map((v, idx) => (
                <p key={idx} className="text-base md:text-lg font-medium text-rose-200 leading-relaxed">
                  « {v} »
                </p>
              ))}
            </div>

            {/* Interpretation */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/20 text-xs md:text-sm text-pink-200/90 leading-relaxed mb-6">
              <span className="font-bold text-rose-400 block mb-1">تعبیر این فال برای ما:</span>
              {divinationPoem.noteForNazanin}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={takeDivination}
                className="px-4 py-2 rounded-xl bg-rose-900/50 hover:bg-rose-900 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>یک فال دیگر</span>
              </button>
              <button
                onClick={() => setIsDivinationModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                بستن و شکر این عشق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
