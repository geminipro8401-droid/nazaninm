import React, { useState, useEffect } from 'react';
import { Compass, Moon, Sun, Heart, Radio, Globe2 } from 'lucide-react';

export const DualTimezoneWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPersianTime = (d: Date, timeZoneOffsetHours = 0) => {
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * (3.5 + timeZoneOffsetHours)); // Iran Standard Time + optional offset
    const hours = nd.getHours().toString().padStart(2, '0');
    const minutes = nd.getMinutes().toString().padStart(2, '0');
    const seconds = nd.getSeconds().toString().padStart(2, '0');

    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const formatted = `${hours}:${minutes}:${seconds}`.replace(/\d/g, d => farsiDigits[parseInt(d, 10)]);
    const isNight = nd.getHours() >= 19 || nd.getHours() < 6;

    return { timeStr: formatted, isNight, rawHours: nd.getHours() };
  };

  const myClock = formatPersianTime(time, 0);
  const nazaninClock = formatPersianTime(time, 0); // Can be customized or synchronized

  return (
    <div className="relative my-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-[#140514]/90 via-[#0d030f]/90 to-[#140514]/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left: My Clock */}
        <div className="flex items-center justify-between md:justify-start gap-4 p-3.5 rounded-xl bg-black/40 border border-rose-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-950/70 border border-rose-500/20 flex items-center justify-center text-rose-400">
              {myClock.isNight ? <Moon className="w-5 h-5 text-indigo-300" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <div className="text-xs text-pink-300/70 font-medium">زمان من</div>
              <div className="text-lg md:text-xl font-black text-pink-100 tracking-wider">
                {myClock.timeStr}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-pink-400/50 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-900/30">
            {myClock.isNight ? 'آسمان پرستاره' : 'روز روشن'}
          </span>
        </div>

        {/* Center: Heart Connection Telemetry */}
        <div className="text-center px-4 py-2 border-y md:border-y-0 md:border-x border-rose-950/80 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-bold mb-1">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>سیگنال تپش قلب متصل است</span>
          </div>

          <div className="text-xs text-pink-200/80 flex items-center gap-2 my-1">
            <span>فاصله جغرافیایی: <b className="text-rose-300">ارقام بی‌معنی</b></span>
            <span>•</span>
            <span>فاصله دل‌ها: <b className="text-green-400">۰ کیلومتر</b></span>
          </div>

          <div className="text-[11px] text-pink-300/50 italic flex items-center gap-1 mt-1">
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>هر دو زیر یک ماه کامل در حال نفس کشیدنیم</span>
          </div>
        </div>

        {/* Right: Nazanin's Clock */}
        <div className="flex items-center justify-between md:justify-end gap-4 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/30 to-black/40 border border-rose-500/30">
          <span className="text-[10px] text-rose-300 bg-rose-900/50 px-2.5 py-0.5 rounded-md border border-rose-500/30 font-semibold order-2 md:order-1">
            کیوتک من
          </span>
          <div className="flex items-center gap-3 order-1 md:order-2 text-right">
            <div>
              <div className="text-xs text-rose-300 font-medium">زمان نازنینم</div>
              <div className="text-lg md:text-xl font-black text-rose-200 tracking-wider">
                {nazaninClock.timeStr}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-900/40 border border-rose-400/30 flex items-center justify-center text-pink-300 shadow-sm shadow-rose-950">
              {nazaninClock.isNight ? <Moon className="w-5 h-5 text-pink-300" /> : <Sun className="w-5 h-5 text-rose-300" />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
