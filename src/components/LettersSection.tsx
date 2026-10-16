import React, { useState, useEffect } from 'react';
import { Mail, Heart, Sparkles, Plus, X, Send, Copy, Check, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveLetter } from '../types';
import { INITIAL_LETTERS } from '../data/romanticData';
import { loveSoundEngine } from '../audio/loveSynth';

export const LettersSection: React.FC = () => {
  const STORAGE_KEY_LETTERS = 'nazanin_custom_letters';

  const [letters, setLetters] = useState<LoveLetter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LETTERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_LETTERS, ...parsed];
      } catch {
        return INITIAL_LETTERS;
      }
    }
    return INITIAL_LETTERS;
  });

  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [kissCount, setKissCount] = useState<number>(0);

  // New letter form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPoem, setNewPoem] = useState('');

  const filteredLetters = activeCategory === 'all'
    ? letters
    : letters.filter(l => l.category === activeCategory);

  const openLetter = (letter: LoveLetter) => {
    setSelectedLetter(letter);
    loveSoundEngine.playSparkle();
  };

  const closeLetter = () => {
    setSelectedLetter(null);
  };

  const handleSendVirtualKiss = () => {
    setKissCount(prev => prev + 1);
    loveSoundEngine.playHeartbeat();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ff2a6d', '#ff758c', '#ff7eb3']
    });
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }
  };

  const copyLetterText = (letter: LoveLetter) => {
    const fullText = `${letter.title}\n\n${letter.poemExcerpt ? letter.poemExcerpt + '\n\n' : ''}${letter.content}\n\n— تقدیم با عشق به نازنینم (یکی یدونم)`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(letter.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNewLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newLetter: LoveLetter = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'نامه‌ای اختصاصی از قلب من برای نازنین',
      category: 'secrets',
      content: newContent.trim(),
      poemExcerpt: newPoem.trim() || undefined,
      date: new Date().toLocaleDateString('fa-IR'),
      waxSealColor: '#e11d48',
      isUserCreated: true
    };

    const updatedList = [...letters, newLetter];
    setLetters(updatedList);

    // Save user created letters to localStorage
    const userOnly = updatedList.filter(l => l.isUserCreated);
    localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(userOnly));

    setIsWriteModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewContent('');
    setNewPoem('');

    loveSoundEngine.playSparkle();
    confetti({
      particleCount: 80,
      spread: 80,
      colors: ['#e11d48', '#fda4af', '#f43f5e']
    });
  };

  return (
    <section id="letters-section" className="my-16 relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          صندوقچه نامه‌های عاشقانه
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-red-400 mb-2">
          نامه‌هایی برای وقتی که...
        </h2>
        <p className="text-sm md:text-base text-pink-200/70">
          برای هر حالتی از دلتنگی نازنینم، یک پاکت نامه سه‌بعدی مهر و موم شده آماده است.
        </p>
      </div>

      {/* Filter Categories & Write Letter Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'همه نامه‌ها' },
            { key: 'miss-you', label: 'وقتی دلتنگی' },
            { key: 'comfort', label: 'وقتی خسته‌ای' },
            { key: 'future', label: 'آیندمون' },
            { key: 'midnight', label: 'نیمه‌شب‌ها' },
            { key: 'promises', label: 'قول‌های من' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950 border border-rose-400/40'
                  : 'bg-black/40 text-pink-300/70 hover:text-white border border-rose-950 hover:border-rose-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>نوشتن نامه جدید برای نازنین</span>
        </button>
      </div>

      {/* 3D Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLetters.map((letter) => (
          <div
            key={letter.id}
            onClick={() => openLetter(letter)}
            className="group relative cursor-pointer perspective-1000 select-none"
          >
            {/* 3D Envelope Container with tilt on hover */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#1c0819] via-[#120412] to-[#0a020a] p-6 border border-rose-900/40 hover:border-rose-500/60 shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-rose-950/40 group-hover:shadow-2xl overflow-hidden">
              
              {/* Envelope flap visual simulation */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-rose-950/50 to-transparent border-b border-rose-500/10 pointer-events-none" />

              {/* Wax Seal Stamp */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-800 to-red-600 border border-rose-300/40 flex items-center justify-center shadow-md shadow-red-950 group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-[11px] font-medium text-pink-400/60 bg-black/40 px-2.5 py-1 rounded-full border border-rose-950">
                  {letter.date}
                </span>
              </div>

              {/* Title & Preview */}
              <h3 className="text-lg font-bold text-pink-100 group-hover:text-rose-300 transition-colors mb-1.5">
                {letter.title}
              </h3>
              <p className="text-xs text-pink-300/60 line-clamp-2 leading-relaxed mb-4">
                {letter.subtitle}
              </p>

              {/* Action Hint */}
              <div className="pt-3 border-t border-rose-950/60 flex items-center justify-between text-xs text-rose-400 font-medium">
                <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>برای گشودن نامه کلیک کن</span>
                  <span>←</span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-pink-400/60 group-hover:text-pink-300 group-hover:rotate-12 transition-all" />
              </div>

              {/* Subtle corner badge if user created */}
              {letter.isUserCreated && (
                <div className="absolute top-2 left-2 text-[10px] text-pink-300 bg-rose-900/60 px-2 py-0.5 rounded-md border border-rose-500/20">
                  نامه دلخواه
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Reading Letter */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c0818] via-[#100311] to-[#080208] border border-rose-500/40 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Top Close Button */}
            <button
              onClick={closeLetter}
              className="absolute top-5 left-5 p-2 rounded-full bg-black/60 hover:bg-black text-pink-300 hover:text-white border border-rose-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="text-center mb-6 pt-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-red-700 to-rose-500 border border-rose-300/40 shadow-lg shadow-red-950 mb-3">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-black text-rose-200 mb-1">
                {selectedLetter.title}
              </h3>
              <p className="text-xs text-pink-300/60">
                {selectedLetter.subtitle}
              </p>
            </div>

            {/* Letter Body Scrollable */}
            <div className="overflow-y-auto px-2 py-4 space-y-4 text-pink-100/90 leading-loose text-sm md:text-base border-y border-rose-900/30">
              {/* Poem Excerpt if present */}
              {selectedLetter.poemExcerpt && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-center font-medium text-rose-300 text-sm md:text-base italic">
                  « {selectedLetter.poemExcerpt} »
                </div>
              )}

              {/* Main content paragraphs */}
              {selectedLetter.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 text-left font-romantic text-2xl text-pink-400">
                Forever yours, always with you ❤️
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleSendVirtualKiss}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950 cursor-pointer active:scale-95 transition-transform"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>فرستادن بوسه مجازی ({kissCount > 0 ? kissCount : 'بوس'})</span>
              </button>

              <button
                onClick={() => copyLetterText(selectedLetter)}
                className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black border border-rose-900/60 text-pink-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === selectedLetter.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی متن نامه</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Write New Custom Letter */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#140615] border border-rose-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-black/60 hover:bg-black text-pink-300 hover:text-white border border-rose-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-rose-900/60 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-300 mb-2">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-rose-200">
                نوشتن نامه‌ای تازه برای نازنین
              </h3>
              <p className="text-xs text-pink-300/70">
                این نامه در مرورگر ذخیره خواهد شد و برای همیشه در صندوقچه می‌ماند.
              </p>
            </div>

            <form onSubmit={handleSaveNewLetter} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pink-300 mb-1">
                  عنوان نامه:
                </label>
                <input
                  type="text"
                  placeholder="مثال: وقتی دلتنگ خنده‌هات میشم..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-rose-900/60 text-white text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pink-300 mb-1">
                  زیرعنوان کوتاه:
                </label>
                <input
                  type="text"
                  placeholder="مثال: باز کن وقتی نیاز به شنیدن حرفام داری"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-rose-900/60 text-white text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pink-300 mb-1">
                  بیت شعر یا جمله کلیدی (اختیاری):
                </label>
                <input
                  type="text"
                  placeholder="مثال: تو مرا جان و جهانی، چه کنم جان و جهان را..."
                  value={newPoem}
                  onChange={(e) => setNewPoem(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-rose-900/60 text-white text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pink-300 mb-1">
                  متن احساسی نامه:
                </label>
                <textarea
                  rows={5}
                  placeholder="هر آنچه در دلت نسبت به نازنین داری اینجا بنویس..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-rose-900/60 text-white text-sm focus:outline-hidden focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/50 hover:bg-black text-pink-300 text-xs transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ثبت و امضا برای نازنین</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
