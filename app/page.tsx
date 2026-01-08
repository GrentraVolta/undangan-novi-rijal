'use client';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MailOpen, MapPin, Heart, Volume2, VolumeX, Navigation, Calendar, MessageCircle } from 'lucide-react';

// --- TRIK AMPUH UNTUK LOLOS BUILD NETLIFY/VERCEL ---
// Kita ubah semua komponen motion menjadi 'any' agar TypeScript tidak protes
const M: any = motion;
const MotionDiv = M.div;
const MotionSection = M.section;
const MotionP = M.p;
const MotionH1 = M.h1;
const MotionH2 = M.h2;

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  useEffect(() => {
    const targetDate = new Date("2026-01-10T08:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const bgY = useTransform(scrollY, [0, 5000], [0, -400]); 
  const bgScale = useTransform(scrollY, [0, 5000], [1.1, 1.3]);

  const openInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) { 
      audioRef.current.play().catch((err) => console.log("Audio play blocked", err)); 
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CornerOrnaments = () => (
    <>
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#BF953F]/40 rounded-tl-[40px] pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#BF953F]/40 rounded-br-[40px] pointer-events-none z-10" />
    </>
  );

  return (
    <main className="min-h-screen relative overflow-x-hidden font-sans bg-transparent">
      <audio ref={audioRef} loop src="/wedding.mp3" />

      <div className="fixed inset-0 -z-20">
        <MotionDiv style={{ y: bgY, scale: bgScale } as any} className="w-full h-full">
            <img src="/bg-wedding.jpg" className="w-full h-full object-cover" alt="Background" />
        </MotionDiv>
      </div>

      {isOpen && (
        <MotionDiv
          className="fixed top-0 left-0 right-0 h-1 bg-[#BF953F] origin-left z-[200]"
          style={{ scaleX: scrollYProgress } as any} 
        />
      )}

      <AnimatePresence>
        {!isOpen && (
          <MotionSection
            key="cover"
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
          >
            <div className="absolute inset-0">
               <img src="/bg-wedding.jpg" className="w-full h-full object-cover opacity-60 scale-110" alt="bg" />
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>
            <div className="relative z-10 text-center px-4 max-w-2xl">
              <MotionP initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[#D4C3B3] tracking-[0.4em] uppercase text-[10px] mb-6 font-bold">
                Undangan Pernikahan
              </MotionP>
              <MotionH1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-8xl gold-text font-serif mb-12">
                Novi Salsabilah & Rijal Fauji
              </MotionH1>
              
              <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-black/40 backdrop-blur-xl p-10 rounded-[50px] border border-white/10 shadow-2xl relative">
                <CornerOrnaments />
                <p className="text-gray-400 text-xs mb-4 italic uppercase tracking-widest">Special Guest:</p>
                <MotionH2 initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.2em" }} transition={{ duration: 2 }} className="text-3xl text-white font-serif mb-8 border-b border-[#BF953F]/30 pb-4 inline-block">
                  {guestName}
                </MotionH2>
                <button onClick={openInvitation} className="w-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black py-4 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform active:scale-95 shadow-[0_10px_30px_rgba(191,149,63,0.3)]">
                  <MailOpen size={16} /> Buka Undangan
                </button>
              </MotionDiv>
            </div>
          </MotionSection>
        )}
      </AnimatePresence>

      {isOpen && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} 
            className="fixed bottom-6 right-6 z-50 p-4 bg-black/60 border border-[#BF953F] rounded-full text-[#BF953F] backdrop-blur-md shadow-2xl hover:bg-[#BF953F] hover:text-black transition-all">
            {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
          </button>

          <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
            <div className="container mx-auto max-w-6xl relative">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                <MotionDiv initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="hidden md:block aspect-[3/4] rounded-full overflow-hidden border-2 border-[#BF953F]/30 shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
                  <img src="/mempelai.jpg" className="w-full h-full object-cover scale-110" alt="Novi" />
                </MotionDiv>
                <div className="col-span-2 md:col-span-1 text-center z-10">
                  <MotionDiv initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
                    <span className="text-[#BF953F] tracking-[0.6em] uppercase text-[10px] font-black">The Wedding of</span>
                    <MotionH1 className="text-6xl md:text-7xl gold-text font-serif mt-6 mb-4 leading-tight">Novi Salsabilah & Rijal Fauji</MotionH1>
                    <p className="text-white tracking-[0.4em] font-light mb-12 italic border-y border-white/10 py-2 inline-block">10 . 01 . 2026</p>
                    <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                       {[{ l: 'Hari', v: timeLeft.hari }, { l: 'Jam', v: timeLeft.jam }, { l: 'Menit', v: timeLeft.menit }, { l: 'Detik', v: timeLeft.detik }].map((t, i) => (
                         <div key={i} className="bg-white/5 backdrop-blur-md border border-[#BF953F]/20 p-3 rounded-2xl shadow-xl">
                            <div className="text-xl font-bold gold-text font-serif">{t.v}</div>
                            <div className="text-[8px] uppercase text-gray-400 tracking-tighter">{t.l}</div>
                         </div>
                       ))}
                    </div>
                  </MotionDiv>
                </div>
                <MotionDiv initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="hidden md:block aspect-[3/4] rounded-full overflow-hidden border-2 border-[#BF953F]/30 shadow-2xl rotate-[5deg] hover:rotate-0 transition-transform duration-700">
                  <img src="/mempelai2.jpg" className="w-full h-full object-cover scale-110" alt="Rijal" />
                </MotionDiv>
              </div>
            </div>
          </section>

          <section className="max-w-4xl mx-auto px-6 py-32 text-center relative">
             <Heart className="mx-auto text-[#BF953F] mb-10 animate-pulse" size={40} />
             <p className="text-xl md:text-3xl font-serif italic gold-text mb-8 leading-relaxed">
                "Dan diantara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
             </p>
             <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">— QS. Ar-Rum: 21</p>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-24 text-center">
            <h3 className="text-2xl gold-text mb-12 font-serif tracking-[0.2em]">Assalamu’alaikum Wr. Wb.</h3>
            <div className="flex flex-col md:flex-row items-center justify-around gap-12">
              <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="group">
                <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#BF953F]/30">
                  <img src="/mempelai.jpg" className="w-full h-full object-cover" alt="Novi" />
                </div>
                <MotionH2 className="text-4xl md:text-5xl font-serif gold-text mb-4">Novi Salsabilah</MotionH2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em]">Putri Bpk. Abdul Mutolib & Ibu Sri Rahayu</p>
              </MotionDiv>
              <div className="text-5xl font-serif text-[#BF953F]">&</div>
              <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="group">
                <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#BF953F]/30">
                  <img src="/mempelai2.jpg" className="w-full h-full object-cover" alt="Rijal" />
                </div>
                <MotionH2 className="text-4xl md:text-5xl font-serif gold-text mb-4">Rijal Fauji</MotionH2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em]">Putra Bpk. Ajidin & Ibu Sri Rahayu</p>
              </MotionDiv>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-24">
             <h3 className="text-3xl gold-text mb-16 font-serif text-center uppercase tracking-[0.3em]">Our Moments</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <MotionDiv key={i} whileHover={{ scale: 1.05 }} className="aspect-[3/4] rounded-[30px] overflow-hidden border-2 border-[#BF953F]/20 shadow-2xl">
                    <img src={`/foto${i}.jpg`} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                  </MotionDiv>
                ))}
             </div>
          </section>

          <section className="max-w-5xl mx-auto px-6 py-24">
            <div className="ornate-card p-8 md:p-20 text-center relative overflow-hidden">
              <CornerOrnaments />
              <Calendar className="mx-auto text-[#BF953F] mb-10" size={40} />
              <h3 className="text-4xl gold-text mb-16 font-serif uppercase tracking-[0.3em]">Waktu & Lokasi</h3>
              <div className="grid md:grid-cols-2 gap-16 mb-16">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h5 className="font-black text-[#BF953F] text-xs uppercase mb-4 tracking-widest">Akad Nikah</h5>
                  <p className="text-2xl font-serif mb-2 text-white">Sabtu, 10 Januari 2026</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h5 className="font-black text-[#BF953F] text-xs uppercase mb-4 tracking-widest">Resepsi</h5>
                  <p className="text-2xl font-serif mb-2 text-white">Sabtu, 10 Januari 2026</p>
                </div>
              </div>
              <div className="rounded-[40px] overflow-hidden h-96 mb-12 border-2 border-[#BF953F]/30">
                <iframe src="http://googleusercontent.com/maps.google.com/5" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
              </div>
              <a href="https://maps.google.com" target="_blank" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black px-12 py-5 rounded-full font-black text-xs uppercase shadow-2xl transition-transform hover:scale-105 active:scale-95">
                <Navigation size={18} /> Petunjuk Lokasi
              </a>
            </div>
          </section>

          <section className="max-w-4xl mx-auto px-6 py-24 text-center">
             <h3 className="text-4xl gold-text mb-16 font-serif uppercase tracking-[0.3em]">Informasi Transfer</h3>
             <div className="grid md:grid-cols-2 gap-8">
                {[{ bank: "Bank SEABANK", norek: "901237587629", an: "Novi Salsabilah", id: "S1" }, { bank: "Bank BCA", norek: "8880815017", an: "Rijal Fauji", id: "B1" }].map((card) => (
                  <div key={card.id} className="ornate-card p-12 relative group">
                    <CornerOrnaments />
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-6 font-bold">{card.bank}</p>
                    <p className="text-3xl font-bold text-white mb-4">{card.norek}</p>
                    <p className="gold-text italic font-serif mb-10 text-xl">a.n {card.an}</p>
                    <button onClick={() => copyToClipboard(card.norek, card.id)} className="px-10 py-3 border border-[#BF953F] rounded-full text-[10px] uppercase font-bold text-[#BF953F] hover:bg-[#BF953F] hover:text-black transition-colors">
                      {copied === card.id ? "Berhasil Disalin" : "Salin Rekening"}
                    </button>
                  </div>
                ))}
             </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-24">
             <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 relative overflow-hidden">
                   <h3 className="text-2xl gold-text mb-10 font-serif uppercase tracking-widest">Konfirmasi Kehadiran</h3>
                   <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4 font-bold">Nama Lengkap</label>
                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none text-white focus:border-[#BF953F]" placeholder="Masukkan Nama Anda" />
                      </div>
                      <button onClick={() => window.open(`https://wa.me/628?text=Konfirmasi Kehadiran`)} className="w-full py-5 bg-[#BF953F] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:brightness-110 active:scale-95 flex items-center justify-center gap-2">
                        <MessageCircle size={16} /> Kirim via WhatsApp
                      </button>
                   </form>
                </div>
                <div className="flex flex-col">
                   <h3 className="text-2xl gold-text mb-10 font-serif uppercase tracking-widest px-4">Buku Tamu</h3>
                   <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 h-[450px] overflow-y-auto space-y-6 custom-scrollbar">
                      {[1, 2, 3].map((i) => (
                        <MotionDiv initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} key={i} className="bg-white/5 p-6 rounded-3xl border-l-4 border-[#BF953F]">
                          <p className="text-xs gold-text font-black mb-2 uppercase">Keluarga Besar</p>
                          <p className="text-[12px] text-gray-300 italic leading-relaxed">"Selamat menempuh hidup baru Novi & Rijal!"</p>
                        </MotionDiv>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          <section className="py-40 px-6 text-center relative">
             <h3 className="text-3xl gold-text mb-12 font-serif uppercase tracking-[0.4em]">Doa Pengantin</h3>
             <p className="text-2xl md:text-3xl italic text-gray-200 mb-10 font-serif max-w-4xl mx-auto leading-relaxed">
               بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ<br />
               <span className="text-lg block mt-6 text-[#BF953F]">Barakallahu laka wa baraka ‘alaika wa jama’a bainakuma fii khoir</span>
             </p>
             <div className="mt-32">
               <h4 className="text-5xl md:text-8xl gold-text font-serif mb-12">Novi Salsabilah & Rijal Fauji</h4>
               <p className="text-[9px] text-gray-600 uppercase tracking-[0.5em] font-bold">Digital Invitation by @grentravlt_ </p>
             </div>
          </section>
        </MotionDiv>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #BF953F; border-radius: 10px; }
      `}</style>
    </main>
  );
}

export default function WeddingPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center gold-text font-serif text-2xl animate-pulse">Memuat Undangan Mewah...</div>}>
      <InvitationContent />
    </Suspense>
  );
}
