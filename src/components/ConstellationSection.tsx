import React, { useState } from 'react';
import { Sparkles, Star, Heart, Calendar, MessageCircle, PhoneCall, ShieldCheck, Plane } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveSoundEngine } from '../audio/loveSynth';

interface MemoryStar {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  quote: string;
  icon: 'message' | 'phone' | 'heart' | 'oath' | 'flight';
  x: number; // percentage in svg
  y: number; // percentage in svg
}

const MEMORY_STARS: MemoryStar[] = [
  {
    id: 1,
    title: 'اولین پیامی که همه چی رو تغییر داد',
    date: 'نقطه عطف شروع قشنگمون',
    category: 'اولین جرقه',
    description: 'یک مکالمه ساده که تبدیل به عمیق‌ترین پیوند زندگیم شد. وقتی اسمت رو صفحه گوشیم روشن شد، انگار یه چراغ توی تاریک‌ترین شب‌های من روشن شد.',
    quote: 'تو زیباترین اتفاق تصادفیِ سرنوشت من بودی نازنین.',
    icon: 'message',
    x: 20,
    y: 35
  },
  {
    id: 2,
    title: 'تماسی که تا طلوع آفتاب ادامه داشت',
    date: 'شب‌های بی‌خوابی عاشقانه',
    category: 'نجواهای شبانه',
    description: 'ساعت‌ها از پشت گوشی حرف زدیم، خندیدیم، سکوت کردیم و وقتی به خودمون اومدیم دیدیم آفتاب زده ولی هنوز دلمون نمی‌خواست تماس قطع بشه.',
    quote: 'صدات همون لالایی بود که قلب بی‌قرارم سال‌ها منتظرش بود.',
    icon: 'phone',
    x: 38,
    y: 70
  },
  {
    id: 3,
    title: 'شبی که فهمیدم «یکی یدونم» هستی',
    date: 'اعتراف قلبی',
    category: 'تثبیت عشق',
    description: 'اون شبی که فهمیدم هیچ فاصله‌ای، هیچ انسانی و هیچ مانعی نمی‌تونه جای تورو توی سینه‌ام تنگ کنه. تو قلب دوم من شدی کیوتک من.',
    quote: 'من با تو تمام خودم رو پیدا کردم...',
    icon: 'heart',
    x: 62,
    y: 70
  },
  {
    id: 4,
    title: 'عهدی که زیر آسمان بستیم',
    date: 'سوگند وفاداری',
    category: 'پایدار تا همیشه',
    description: 'قول دادیم پای هم بمونیم، سختی این دوری رو به جان بخریم و پلی بسازیم از جنس صبر و وفاداری تا روزی که هیچ فاصله‌ای بینمون نباشه.',
    quote: 'گر چه دوریم ز بزم تو، به فرمان ادب... نامت ای مونس جان ورد زبان است هنوز.',
    icon: 'oath',
    x: 80,
    y: 35
  },
  {
    id: 5,
    title: 'روز رسیدن به هم و پایان انتظار',
    date: 'پرواز به سوی آغوش تو',
    category: 'لحظه موعود',
    description: 'اون لحظه‌ای که چمدون به دست، چشمم توی سالن به چشمات بیفته و بدوم سمتت... تمام ثانیه‌های این روزشمار فدای یک ثانیه لمس دستات.',
    quote: 'تمام فاصله‌ها محو میشن وقتی سرم روی سینه‌ات آروم بگیره نازنینم.',
    icon: 'flight',
    x: 50,
    y: 20
  }
];

export const ConstellationSection: React.FC = () => {
  const [selectedStar, setSelectedStar] = useState<MemoryStar | null>(MEMORY_STARS[2]);

  const handleStarClick = (star: MemoryStar) => {
    setSelectedStar(star);
    loveSoundEngine.playSparkle();
    if (navigator.vibrate) {
      navigator.vibrate(60);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4 text-rose-400" />;
      case 'phone': return <PhoneCall className="w-4 h-4 text-pink-400" />;
      case 'heart': return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case 'oath': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'flight': return <Plane className="w-4 h-4 text-pink-300" />;
      default: return <Star className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <section className="my-16 relative">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>صورت‌فلکی اختصاصی عشق ما</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-red-400 mb-2">
          نقشه آسمانی خاطرات من و نازنین
        </h2>
        <p className="text-sm md:text-base text-pink-200/70">
          روی هر ستاره کلیک کن تا خطوط کهکشانی روشن شوند و خاطره آن شب زنده شود.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* The Constellation Celestial Canvas (Left/Center) */}
        <div className="lg:col-span-7 relative h-[360px] md:h-[420px] rounded-3xl bg-radial from-[#1e0720] via-[#0c020d] to-[#040106] border border-rose-500/30 shadow-2xl p-4 overflow-hidden">
          
          {/* Subtle star dust background */}
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

          {/* SVG Constellation Lines Connecting Stars into a Heart */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Connecting lines */}
            <path
              d="M 50,20 L 20,35 L 38,70 L 50,90 L 62,70 L 80,35 Z"
              fill="rgba(225, 29, 72, 0.04)"
              stroke="rgba(244, 63, 94, 0.35)"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
            {/* Active glow connection to selected star */}
            {selectedStar && (
              <circle
                cx={selectedStar.x}
                cy={selectedStar.y}
                r="7"
                fill="none"
                stroke="rgba(255, 105, 180, 0.6)"
                strokeWidth="0.5"
                className="animate-ping"
              />
            )}
          </svg>

          {/* Star Nodes */}
          {MEMORY_STARS.map((star) => {
            const isSelected = selectedStar?.id === star.id;
            return (
              <button
                key={star.id}
                onClick={() => handleStarClick(star)}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute group p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'scale-125 bg-gradient-to-tr from-red-600 to-rose-400 shadow-[0_0_25px_#f43f5e] z-30'
                    : 'bg-black/80 hover:bg-rose-950/80 border border-rose-500/40 hover:scale-110 z-20'
                }`}
                title={star.title}
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-white fill-white' : 'text-rose-300 fill-rose-300/40 group-hover:fill-rose-300'
                  }`}
                />

                {/* Floating label */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-pink-200 bg-black/80 px-2 py-0.5 rounded-md border border-rose-950 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {star.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Memory Star Card (Right) */}
        <div className="lg:col-span-5">
          {selectedStar ? (
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#20081a] via-[#140413] to-[#0a0208] border border-rose-500/40 shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 text-rose-300 text-xs font-semibold border border-rose-900">
                  {getIcon(selectedStar.icon)}
                  <span>{selectedStar.category}</span>
                </span>
                <span className="text-xs text-pink-400/70 font-medium">
                  {selectedStar.date}
                </span>
              </div>

              <h3 className="text-xl font-bold text-pink-100 mb-3">
                {selectedStar.title}
              </h3>

              <p className="text-sm text-pink-200/80 leading-relaxed mb-6">
                {selectedStar.description}
              </p>

              <div className="p-4 rounded-2xl bg-black/50 border border-rose-900/60 text-xs md:text-sm text-rose-300 leading-relaxed italic">
                « {selectedStar.quote} »
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
