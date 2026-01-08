'use client';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MailOpen, MapPin, Heart, Volume2, VolumeX, Navigation, Copy, CheckCircle2, Calendar, MessageCircle } from 'lucide-react';

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // 1. LOGIKA HITUNG MUNDUR
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

  // 2. LOGIKA PARALLAX & SCROLL
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

      {/* GAMBAR BACKGROUND UTAMA */}
      <div className="fixed inset-0 -z-20">
        <motion.div style={{ y: bgY, scale: bgScale } as any} className="w-full h-full">
            <img src="/bg-wedding.jpg" className="w-full h-full object-cover" alt="Background" />
        </motion.div>
      </div>

      {/* Progress Bar */}
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-[#BF953F] origin-left z-[200]"
          style={{ scaleX: scrollYProgress } as any} 
        />
      )}

      {/* LANDING PAGE / COVER */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.section
            key="cover"
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' } as any}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
          >
            <div className="absolute inset-0">
               <img src="/bg-wedding.jpg" className="w-full h-full object-cover opacity-60 scale-110" alt="bg" />
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>
            <div className="relative z-10 text-center px-4 max-w-2xl">
              <motion.p initial={{ opacity: 0, y: 20 } as any} animate={{ opacity: 1, y: 0 } as any} className="text-[#D4C3B3] tracking-[0.4em] uppercase text-[10px] mb-6 font-bold">
                Undangan Pernikahan
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 } as any} animate={{ opacity: 1, y: 0 } as any} transition={{ delay: 0.2 }} className="text-5xl md:text-8xl gold-text font-serif mb-12">
                Novi Salsabilah & Rijal Fauji
              </motion.h1>
              
              <motion.div initial={{ opacity: 0, scale: 0.9 } as any} animate={{ opacity: 1, scale: 1 } as any} transition={{ delay: 0.4 }} className="bg-black/40 backdrop-blur-xl p-10 rounded-[50px] border border-white/10 shadow-2xl relative">
                <CornerOrnaments />
                <p className="text-gray-400 text-xs mb-4 italic uppercase tracking-widest">Special Guest:</p>
                <motion.h2 initial={{ opacity: 0, letterSpacing: "0.1em" } as any} animate={{ opacity: 1, letterSpacing: "0.2em" } as any} transition={{ duration: 2 }} className="text-3xl text-white font-serif mb-8 border-b border-[#BF953F]/30 pb-4 inline-block">
                  {guestName}
                </motion.h2>
                <button onClick={openInvitation} className="w-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black py-4 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform active:scale-95 shadow-[0_10px_30px_rgba(191,149,63,0.3)]">
                  <MailOpen size={16} /> Buka Undangan
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ISI UNDANGAN LENGKAP */}
      {isOpen && (
        <motion.div initial={{ opacity: 0 } as any} animate={{ opacity: 1 } as any} transition={{ duration: 1.5 }}>
          
          <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} 
            className="fixed bottom-6 right-6 z-50 p-4 bg-black/60 border border-[#BF953F] rounded-full text-[#BF953F] backdrop-blur-md shadow-2xl hover:bg-[#BF953F] hover:text-black transition-all">
            {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
          </button>

          {/* 1. HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
            <div className="container mx-auto max-w-6xl relative">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                <motion.div initial={{ opacity: 0, x: -50 } as any} whileInView={{ opacity: 1, x: 0 } as any} transition={{ duration: 1 }} className="hidden md:block aspect-[3/4] rounded-full overflow-hidden border-2 border-[#BF953F]/30 shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
                  <img src="/mempelai.jpg" className="w-full h-full object-cover scale-110" alt="Novi" />
                </motion.div>

                <div className="col-span-2 md:col-span-1 text-center z-10">
                  <motion.div initial={{ opacity: 0, scale: 0.8 } as any} whileInView={{ opacity: 1, scale: 1 } as any} transition={{ duration: 1.2 }}>
                    <span className="text-[#BF953F] tracking-[0.6em] uppercase text-[10px] font-black">The Wedding of</span>
                    <h1 className="text-6xl md:text-7xl gold-text font-serif mt-6 mb-4 leading-tight">Novi Salsabilah & Rijal Fauji</h1>
                    <p className="text-white tracking-[0.4em] font-light mb-12 italic border-y border-white/10 py-2 inline-block">10 . 01 . 2026</p>
                    
                    <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                        <div className="bg-white/5 backdrop-blur-md border border-[#BF953F]/20 p-3 rounded-2xl shadow-xl">
                            <div className="text-xl font-bold gold-text font-serif">{timeLeft.hari}</div>
                            <div className="text-[8px] uppercase text-gray-400 tracking-tighter">Hari</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-[#BF953F]/20 p-3 rounded-2xl shadow-xl">
                            <div className="text-xl font-bold gold-text font-serif">{timeLeft.jam}</div>
                            <div className="text-[8px] uppercase text-gray-400 tracking-tighter">Jam</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-[#BF953F]/20 p-3 rounded-2xl shadow-xl">
                            <div className="text-xl font-bold gold-text font-serif">{timeLeft.menit}</div>
                            <div className="text-[8px] uppercase text-gray-400 tracking-tighter">Menit</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-[#BF953F]/20 p-3 rounded-2xl shadow-xl">
                            <div className="text-xl font-bold gold-text font-serif">{timeLeft.detik}</div>
                            <div className="text-[8px] uppercase text-gray-400 tracking-tighter">Detik</div>
                        </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, x: 50 } as any} whileInView={{ opacity: 1, x: 0 } as any} transition={{ duration: 1 }} className="hidden md:block aspect-[3/4] rounded-full overflow-hidden border-2 border-[#BF953F]/30 shadow-2xl rotate-[5deg] hover:rotate-0 transition-transform duration-700">
                  <img src="/mempelai2.jpg" className="w-full h-full object-cover scale-110" alt="Rijal" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* 2. AR-RUM */}
          <section className="max-w-4xl mx-auto px-6 py-32 text-center relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-white/5 font-serif -z-10 select-none">Love</div>
             <Heart className="mx-auto text-[#BF953F] mb-10 animate-pulse" size={40} />
             <p className="text-xl md:text-3xl font-serif italic gold-text mb-8 leading-relaxed px-4">
                "Dan diantara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tentram kepadanya..."
             </p>
             <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">— QS. Ar-Rum: 21</p>
          </section>

          {/* 3. SALAM & PROFIL */}
          <section className="max-w-6xl mx-auto px-6 py-24 text-center">
            <h3 className="text-2xl gold-text mb-12 font-serif tracking-[0.2em]">Assalamu’alaikum Wr. Wb.</h3>
            <p className="text-sm text-gray-400 mb-20 italic max-w-2xl mx-auto font-light leading-loose">
              Maha suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:
            </p>
            <div className="flex flex-col md:flex-row items-center justify-around gap-12 relative">
              <motion.div initial={{ opacity: 0, y: 30 } as any} whileInView={{ opacity: 1, y: 0 } as any} className="group relative">
                <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#BF953F]/30 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <img src="/mempelai.jpg" className="w-full h-full object-cover" alt="Novi" />
                </div>
                <h4 className="text-4xl md:text-5xl font-serif gold-text mb-4">Novi Salsabilah</h4>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] max-w-[250px] mx-auto leading-relaxed">Putri Kedua dari <br/>Bpk. Abdul Mutolib & Ibu Sri Rahayu</p>
              </motion.div>
              <div className="text-5xl font-serif text-[#BF953F] animate-bounce">&</div>
              <motion.div initial={{ opacity: 0, y: 30 } as any} whileInView={{ opacity: 1, y: 0 } as any} transition={{ delay: 0.2 }} className="group">
                <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#BF953F]/30 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <img src="/mempelai2.jpg" className="w-full h-full object-cover" alt="Rijal" />
                </div>
                <h4 className="text-4xl md:text-5xl font-serif gold-text mb-4">Rijal Fauji</h4>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] max-w-[250px] mx-auto leading-relaxed">Putra Kedua dari <br/>Bpk. Ajidin & Ibu Sri Rahayu</p>
              </motion.div>
            </div>
          </section>

          {/* 4. GALERI FOTO */}
          <section className="max-w-6xl mx-auto px-6 py-24">
             <h3 className="text-3xl gold-text mb-16 font-serif text-center uppercase tracking-[0.3em]">Our Moments</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 } as any} className="aspect-[3/4] rounded-[30px] overflow-hidden border-2 border-[#BF953F]/20 shadow-2xl cursor-pointer">
                    <img src={`/foto${i}.jpg`} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                  </motion.div>
                ))}
             </div>
          </section>

          {/* 5. LOKASI & MAPS */}
          <section className="max-w-5xl mx-auto px-6 py-24">
            <div className="ornate-card p-8 md:p-20 text-center relative overflow-hidden bg-black/40 backdrop-blur-xl rounded-[50px] border border-white/10 shadow-2xl">
              <CornerOrnaments />
              <Calendar className="mx-auto text-[#BF953F] mb-10" size={40} />
              <h3 className="text-4xl gold-text mb-16 font-serif uppercase tracking-[0.3em]">Waktu & Lokasi</h3>
              <div className="grid md:grid-cols-2 gap-16 mb-16 text-white">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h5 className="font-black text-[#BF953F] text-xs uppercase mb-4 tracking-widest">Akad Nikah</h5>
                  <p className="text-2xl font-serif mb-2">Sabtu, 10 Januari 2026</p>
                  <p className="text-sm text-gray-400 italic">Pukul 08.00 - 10.00 WIB</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <h5 className="font-black text-[#BF953F] text-xs uppercase mb-4 tracking-widest">Resepsi</h5>
                  <p className="text-2xl font-serif mb-2">Sabtu, 10 Januari 2026</p>
                  <p className="text-sm text-gray-400 italic">Pukul 11.00 WIB - Selesai</p>
                </div>
              </div>
              <div className="rounded-[40px] overflow-hidden h-96 mb-12 border-2 border-[#BF953F]/30 shadow-inner group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3966.316612642867!2d106.52211109999999!3d-6.2219166999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTMnMTguOSJTIDEwNsKwMzEnMTkuNiJF!5e0!3m2!1sid!2sid!4v1767886903248!5m2!1sid!2sid" 
                  width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} allowFullScreen loading="lazy">
                </iframe>
              </div>
              <a href="https://maps.app.goo.gl/5SY55VUgtx71pgdb8" target="_blank" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform active:scale-95">
                <Navigation size={18} /> Petunjuk Lokasi
              </a>
            </div>
          </section>

          {/* 6. TRANSFER */}
          <section className="max-w-4xl mx-auto px-6 py-24">
             <h3 className="text-4xl gold-text mb-16 font-serif text-center uppercase tracking-[0.3em]">Informasi Transfer</h3>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="ornate-card p-12 text-center bg-black/40 backdrop-blur-xl rounded-[50px] border border-white/10 relative">
                    <CornerOrnaments />
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-6 font-bold">Bank SEABANK</p>
                    <p className="text-3xl font-bold text-white mb-4 tracking-tighter">901237587629</p>
                    <p className="gold-text italic font-serif mb-10 text-xl">a.n Novi Salsabilah</p>
                    <button onClick={() => copyToClipboard("901237587629", "S1")} className="px-10 py-3 border border-[#BF953F] rounded-full text-[10px] uppercase font-bold text-[#BF953F] hover:bg-[#BF953F] hover:text-black transition-all">
                      {copied === "S1" ? "Berhasil Disalin" : "Salin Rekening"}
                    </button>
                </div>
                <div className="ornate-card p-12 text-center bg-black/40 backdrop-blur-xl rounded-[50px] border border-white/10 relative">
                    <CornerOrnaments />
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-6 font-bold">Bank BCA</p>
                    <p className="text-3xl font-bold text-white mb-4 tracking-tighter">8880815017</p>
                    <p className="gold-text italic font-serif mb-10 text-xl">a.n Rijal Fauji</p>
                    <button onClick={() => copyToClipboard("8880815017", "B1")} className="px-10 py-3 border border-[#BF953F] rounded-full text-[10px] uppercase font-bold text-[#BF953F] hover:bg-[#BF953F] hover:text-black transition-all">
                      {copied === "B1" ? "Berhasil Disalin" : "Salin Rekening"}
                    </button>
                </div>
             </div>
          </section>

          {/* 7. RSVP */}
          <section className="max-w-6xl mx-auto px-6 py-24">
             <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 backdrop-blur-xl shadow-2xl relative">
                   <h3 className="text-2xl gold-text mb-10 font-serif uppercase tracking-widest">Konfirmasi Kehadiran</h3>
                   <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4 font-bold">Nama Lengkap</label>
                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#BF953F] outline-none text-white transition-all" placeholder="Masukkan Nama Anda" />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4 font-bold">Kehadiran</label>
                        <select className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#BF953F] outline-none text-white cursor-pointer">
                           <option>Hadir</option>
                           <option>Tidak Dapat Hadir</option>
                        </select>
                      </div>
                      <button onClick={() => window.open(`https://wa.me/085392056236?text=Konfirmasi`)} className="w-full py-5 bg-[#BF953F] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={16} /> Kirim via WhatsApp
                      </button>
                   </form>
                </div>
                <div className="flex flex-col">
                   <h3 className="text-2xl gold-text mb-10 font-serif uppercase tracking-widest px-4">Buku Tamu</h3>
                   <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 h-[450px] overflow-y-auto space-y-6 custom-scrollbar backdrop-blur-xl shadow-inner text-left">
                      {[1, 2, 3].map((i) => (
                        <motion.div initial={{ opacity: 0, x: 20 } as any} whileInView={{ opacity: 1, x: 0 } as any} key={i} className="bg-white/5 p-6 rounded-3xl border-l-4 border-[#BF953F]">
                          <p className="text-xs gold-text font-black mb-2 uppercase tracking-tighter">Keluarga Besar</p>
                          <p className="text-[12px] text-gray-300 italic leading-relaxed">"Selamat menempuh hidup baru Novi & Rijal! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin!"</p>
                        </motion.div>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          {/* 8. PENUTUP */}
          <section className="py-40 px-6 text-center relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-3xl gold-text mb-12 font-serif uppercase tracking-[0.4em]">Doa Pengantin</h3>
               <p className="text-2xl md:text-3xl italic text-gray-200 mb-10 font-serif leading-relaxed max-w-4xl mx-auto">
                 بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ<br />
                 <span className="text-lg block mt-6 text-[#BF953F]">Barakallahu laka wa baraka ‘alaika wa jama’a bainakuma fii khoir</span>
               </p>
               <div className="mt-32">
                 <p className="text-[10px] text-[#BF953F] tracking-[0.8em] uppercase mb-8 font-black">Kami yang berbahagia</p>
                 <h4 className="text-5xl md:text-8xl gold-text font-serif mb-12">Novi Salsabilah & Rijal Fauji</h4>
                 <div className="inline-block px-8 py-3 border-y border-[#BF953F]/30">
                    <p className="text-[9px] text-gray-600 uppercase tracking-[0.5em] font-bold">Digital Invitation by @grentravlt_ </p>
                 </div>
               </div>
             </div>
          </section>
        </motion.div>
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
