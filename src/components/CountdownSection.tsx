import React, { useState, useEffect } from 'react';
import { Clock, Heart, RefreshCw, Plane, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveSoundEngine } from '../audio/loveSynth';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
  totalMs: number;
  percentCompleted: number;
}

export const CountdownSection: React.FC = () => {
  const STORAGE_KEY_TARGET = 'nazanin_countdown_target';
  const STORAGE_KEY_START = 'nazanin_countdown_start';

  const [targetDate, setTargetDate] = useState<Date>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TARGET);
    if (saved) {
      const parsed = new Date(saved);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  });

  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_START);
    if (saved) {
      const parsed = new Date(saved);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const d = new Date();
    return d;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
    millis: 0,
    totalMs: 14 * 24 * 60 * 60 * 1000,
    percentCompleted: 0
  });

  const [isCelebrated, setIsCelebrated] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TARGET, targetDate.toISOString());
    localStorage.setItem(STORAGE_KEY_START, startDate.toISOString());
  }, [targetDate, startDate]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const start = startDate.getTime();
      const difference = target - now;
      const totalSpan = Math.max(target - start, 14 * 24 * 60 * 60 * 1000);

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          millis: 0,
          totalMs: 0,
          percentCompleted: 100
        });
        if (!isCelebrated) {
          setIsCelebrated(true);
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ff2a5f', '#f472b6', '#ffffff', '#e11d48']
          });
        }
        return;
      }

      const elapsed = now - start;
      const percent = Math.min(Math.max((elapsed / totalSpan) * 100, 0), 100);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const millis = Math.floor((difference % 1000) / 10);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        millis,
        totalMs: difference,
        percentCompleted: parseFloat(percent.toFixed(1))
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 40); // 40ms for high-precision milliseconds
    return () => clearInterval(interval);
  }, [targetDate, startDate, isCelebrated]);

  const resetToTwoWeeks = () => {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 14);
    setStartDate(now);
    setTargetDate(future);
    setIsCelebrated(false);
    loveSoundEngine.playSparkle();
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#f43f5e', '#ec4899', '#ffffff']
    });
  };

  const toPersianNum = (n: number | string): string => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => farsiDigits[parseInt(d, 10)]);
  };

  return (
    <section id="countdown-section" className="relative my-16 p-6 md:p-12 rounded-3xl bg-gradient-to-b from-[#160618] via-[#09020b] to-[#120414] border border-luxury-glow box-glow-luxury shadow-2xl overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-3 shadow-md">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span>کرونومتر دقیق وصال • ۲ هفته انتظار</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-300 to-red-400 mb-2">
          چقدر تا آغوش نازنینم مونده؟
        </h2>
        <p className="text-sm md:text-base text-pink-200/70">
          با دقت صدم ثانیه؛ هر نفسی که می‌کشیم ما رو به اولین لمس نزدیک‌تر می‌کنه.
        </p>
      </div>

      {/* Timepiece Chronometer Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10 relative z-10">
        
        {/* Days */}
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#220a1e] to-[#0c030d] border border-rose-500/30 shadow-xl text-center relative group hover:border-rose-400/60 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-black text-rose-400 tracking-wider">
            {toPersianNum(timeLeft.days)}
          </div>
          <div className="text-xs md:text-sm font-semibold text-pink-300/80 mt-2">
            روز انتظار
          </div>
          <div className="text-[10px] text-pink-400/40 mt-1">
            {toPersianNum(timeLeft.days * 24)} ساعت
          </div>
        </div>

        {/* Hours */}
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#220a1e] to-[#0c030d] border border-rose-500/30 shadow-xl text-center relative group hover:border-rose-400/60 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-black text-pink-300 tracking-wider">
            {toPersianNum(timeLeft.hours.toString().padStart(2, '0'))}
          </div>
          <div className="text-xs md:text-sm font-semibold text-pink-300/80 mt-2">
            ساعت عاشقی
          </div>
          <div className="text-[10px] text-pink-400/40 mt-1">
            تا پایان این روز
          </div>
        </div>

        {/* Minutes */}
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#220a1e] to-[#0c030d] border border-rose-500/30 shadow-xl text-center relative group hover:border-rose-400/60 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-black text-rose-300 tracking-wider">
            {toPersianNum(timeLeft.minutes.toString().padStart(2, '0'))}
          </div>
          <div className="text-xs md:text-sm font-semibold text-pink-300/80 mt-2">
            دقیقه دلتنگی
          </div>
          <div className="text-[10px] text-pink-400/40 mt-1">
            با هر تپش قلب
          </div>
        </div>

        {/* Seconds & Milliseconds */}
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#2a0c24] to-[#120414] border border-red-500/40 shadow-xl text-center relative group hover:border-red-400 transition-all duration-300">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl md:text-6xl font-black text-red-400 tracking-wider">
              {toPersianNum(timeLeft.seconds.toString().padStart(2, '0'))}
            </span>
            <span className="text-sm md:text-lg font-bold text-rose-400/80 font-cinzel">
              .{toPersianNum(timeLeft.millis.toString().padStart(2, '0'))}
            </span>
          </div>
          <div className="text-xs md:text-sm font-semibold text-pink-300/80 mt-2">
            ثانیه تا وصال
          </div>
          <div className="text-[10px] text-red-400/70 mt-1 font-bold">
            ضربان زنده
          </div>
        </div>

      </div>

      {/* Progress Track & Milestones */}
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="flex justify-between items-center text-xs text-pink-300/80 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>روز ۱ (آغاز دو هفته صبر)</span>
          </div>
          <div className="font-extrabold text-rose-400 text-sm">
            {toPersianNum(timeLeft.percentCompleted)}٪ طی شده
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Plane className="w-3.5 h-3.5 text-pink-400" />
            <span>روز ۱۴ (در آغوش کشیدن نازنینم ❤️)</span>
          </div>
        </div>

        {/* Progress Bar with glowing gradient */}
        <div className="relative w-full h-4 bg-black/70 rounded-full overflow-hidden border border-rose-950 p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-400 rounded-full transition-all duration-200 shadow-[0_0_15px_#f43f5e]"
            style={{ width: `${Math.max(timeLeft.percentCompleted, 2)}%` }}
          />
        </div>
      </div>

      {/* Footer controls & Romantic oath */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto pt-6 border-t border-rose-950/80 relative z-10 text-xs md:text-sm">
        <div className="flex items-center gap-2 text-pink-200/90 font-medium">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
          <span>«به روزی فکر کن که تمام این ثانیه‌ها تبدیل میشن به نگاه تو در چشمای من...»</span>
        </div>

        <button
          onClick={resetToTwoWeeks}
          className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تنظیم مجدد به ۱۴ روز</span>
        </button>
      </div>

    </section>
  );
};
