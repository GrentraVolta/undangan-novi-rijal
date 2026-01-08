'use client';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  MailOpen, MapPin, Heart, Volume2, VolumeX, Navigation, 
  Copy, CheckCircle2, Calendar, MessageCircle, Gift, Users 
} from 'lucide-react';

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // --- LOGIKA HITUNG MUNDUR ---
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
    <main className="min-h-screen relative overflow-x-hidden font-sans bg-black">
      <audio ref={audioRef} loop src="/wedding.mp3" />

      {/* --- BACKGROUND UTAMA --- */}
      <div className="fixed inset-0 -z-20">
        <motion.div style={{ y: bgY, scale: bgScale } as any} className="w-full h-full">
            <img src="/bg-wedding.jpg" className="w-full h-full object-cover opacity-60" alt="Background" />
        </motion.div>
      </div>

      {/* --- LANDING PAGE (COVER) --- */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.section
            key="cover"
            exit={{ opacity: 0, y: -100, transition: { duration: 1 } } as any}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
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
                <motion.h2 className="text-3xl text-white font-serif mb-8 border-b border-[#BF953F]/30 pb-4 inline-block">
                  {guestName}
                </motion.h2>
                <button onClick={openInvitation} className="w-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-black py-4 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform">
                  <MailOpen size={16} /> Buka Undangan
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- ISI UNDANGAN UTAMA --- */}
      {isOpen && (
        <motion.div initial={{ opacity: 0 } as any} animate={{ opacity: 1 } as any} transition={{ duration: 1.5 }}>
          
          <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} 
            className="fixed bottom-6 right-6 z-50 p-4 bg-black/60 border border-[#BF953F] rounded-full text-[#BF953F] backdrop-blur-md shadow-2xl">
            {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
          </button>

          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#BF953F] origin-left z-[200]" style={{ scaleX: scrollYProgress } as any} />

          {/* SECTION 1: HERO */}
          <section className="relative h-screen flex items-center justify-center px-4">
             <div className="text-center">
                <motion.span initial={{ opacity: 0 } as any} whileInView={{ opacity: 1 } as any} className="text-[#BF953F] tracking-[0.6em] uppercase text-[10px] font-black">The Wedding of</motion.span>
                <h2 className="text-6xl md:text-8xl gold-text font-serif mt-6 mb-8 leading-tight">Novi & Rijal</h2>
                <div className="flex justify-center gap-4">
                   <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-20">
                      <p className="text-2xl font-bold gold-text">{timeLeft.hari}</p>
                      <p className="text-[8px] uppercase text-gray-400">Hari</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-20">
                      <p className="text-2xl font-bold gold-text">{timeLeft.jam}</p>
                      <p className="text-[8px] uppercase text-gray-400">Jam</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-20">
                      <p className="text-2xl font-bold gold-text">{timeLeft.menit}</p>
                      <p className="text-[8px] uppercase text-gray-400">Menit</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-20">
                      <p className="text-2xl font-bold gold-text">{timeLeft.detik}</p>
                      <p className="text-[8px] uppercase text-gray-400">Detik</p>
                   </div>
                </div>
             </div>
          </section>

          {/* SECTION 2: KATA SAMBUTAN (AR-RUM) */}
          <section className="max-w-4xl mx-auto px-6 py-32 text-center">
            <Heart className="mx-auto text-[#BF953F] mb-10 animate-pulse" size={40} />
            <h3 className="text-2xl gold-text font-serif mb-8 italic uppercase tracking-widest">Assalamu’alaikum Wr. Wb.</h3>
            <p className="text-gray-300 mb-12 leading-relaxed">
              Maha suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.
            </p>
            <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 italic font-serif text-xl md:text-2xl gold-text leading-loose">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
              <br/><span className="text-xs mt-6 block text-gray-500 tracking-[0.3em]">— QS. AR-RUM: 21</span>
            </div>
          </section>

          {/* SECTION 3: PROFIL MEMPELAI (SANGAT DETAIL) */}
          <section className="max-w-6xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <motion.div initial={{ x: -50, opacity: 0 } as any} whileInView={{ x: 0, opacity: 1 } as any} className="text-center group">
                <div className="w-64 h-64 mx-auto rounded-full border-4 border-[#BF953F] overflow-hidden mb-8 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                   <img src="/mempelai.jpg" className="w-full h-full object-cover" alt="Novi" />
                </div>
                <h3 className="text-4xl md:text-5xl gold-text font-serif mb-4">Novi Salsabilah</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Putri Kedua Dari:</p>
                <p className="text-white font-serif text-lg leading-relaxed">Bapak Abdul Mutolib <br/> & Ibu Sri Rahayu</p>
              </motion.div>

              <motion.div initial={{ x: 50, opacity: 0 } as any} whileInView={{ x: 0, opacity: 1 } as any} className="text-center group">
                <div className="w-64 h-64 mx-auto rounded-full border-4 border-[#BF953F] overflow-hidden mb-8 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                   <img src="/mempelai2.jpg" className="w-full h-full object-cover" alt="Rijal" />
                </div>
                <h3 className="text-4xl md:text-5xl gold-text font-serif mb-4">Rijal Fauji</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Putra Kedua Dari:</p>
                <p className="text-white font-serif text-lg leading-relaxed">Bapak Ajidin <br/> & Ibu Sri Rahayu</p>
              </motion.div>
            </div>
          </section>

          {/* SECTION 4: GALLERY FOTO (GRID 8 FOTO) */}
          <section className="py-24 px-6 bg-white/5">
             <h3 className="text-center text-3xl gold-text font-serif mb-20 uppercase tracking-[0.4em]">Momen Bahagia</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto1.jpg" className="w-full h-full object-cover" alt="G1"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto2.jpg" className="w-full h-full object-cover" alt="G2"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto3.jpg" className="w-full h-full object-cover" alt="G3"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto4.jpg" className="w-full h-full object-cover" alt="G4"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto5.jpg" className="w-full h-full object-cover" alt="G5"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto6.jpg" className="w-full h-full object-cover" alt="G6"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto7.jpg" className="w-full h-full object-cover" alt="G7"/></div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><img src="/foto8.jpg" className="w-full h-full object-cover" alt="G8"/></div>
             </div>
          </section>

          {/* SECTION 5: LOKASI & WAKTU */}
          <section className="max-w-5xl mx-auto px-6 py-24">
            <div className="bg-black/40 backdrop-blur-xl p-10 md:p-20 rounded-[50px] border border-white/10 relative text-center">
              <CornerOrnaments />
              <Calendar className="mx-auto text-[#BF953F] mb-10" size={40} />
              <h3 className="text-4xl gold-text font-serif mb-16 uppercase tracking-[0.3em]">Waktu & Lokasi</h3>
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <h5 className="gold-text font-bold text-xs uppercase mb-4 tracking-widest">Akad Nikah</h5>
                  <p className="text-2xl font-serif text-white mb-2">Sabtu, 10 Januari 2026</p>
                  <p className="text-sm text-gray-400">08:00 - 10:00 WIB</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <h5 className="gold-text font-bold text-xs uppercase mb-4 tracking-widest">Resepsi</h5>
                  <p className="text-2xl font-serif text-white mb-2">Sabtu, 10 Januari 2026</p>
                  <p className="text-sm text-gray-400">11:00 WIB - Selesai</p>
                </div>
              </div>
              <div className="h-96 rounded-[40px] overflow-hidden border-2 border-[#BF953F]/30 mb-10">
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3966.316612642867!2d106.52211109999999!3d-6.2219166999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTMnMTguOSJTIDEwNsKwMzEnMTkuNiJF!5e0!3m2!1sid!2sid!4v1767886903248!5m2!1sid!2sid" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9)' }}></iframe>
              </div>
              <a href="https://maps.app.goo.gl/5SY55VUgtx71pgdb8" target="_blank" className="inline-flex items-center gap-3 bg-[#BF953F] text-black px-12 py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-2xl">
                 <Navigation size={18} /> Petunjuk Lokasi
              </a>
            </div>
          </section>

          {/* SECTION 6: WEDDING GIFT (REKENING DETAIL) */}
          <section className="max-w-4xl mx-auto px-6 py-24 text-center">
             <Gift className="mx-auto text-[#BF953F] mb-6" size={40} />
             <h3 className="text-3xl gold-text font-serif mb-6 uppercase tracking-widest">Informasi Hadiah</h3>
             <p className="text-gray-400 mb-16 text-sm italic">Doa restu Anda adalah hadiah terindah, namun jika ingin memberi tanda kasih, silakan melalui:</p>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="p-12 bg-white/5 rounded-[50px] border border-white/10 relative">
                   <CornerOrnaments />
                   <p className="text-xs text-gray-500 uppercase font-bold mb-4 tracking-widest">Bank SEABANK</p>
                   <p className="text-2xl font-bold text-white mb-2">901237587629</p>
                   <p className="gold-text font-serif text-lg mb-8 italic">a.n Novi Salsabilah</p>
                   <button onClick={() => copyToClipboard("901237587629", "S1")} className="px-10 py-3 border border-[#BF953F] rounded-full text-[10px] text-[#BF953F] uppercase font-bold tracking-widest">
                     {copied === "S1" ? "Berhasil Disalin" : "Salin Rekening"}
                   </button>
                </div>
                <div className="p-12 bg-white/5 rounded-[50px] border border-white/10 relative">
                   <CornerOrnaments />
                   <p className="text-xs text-gray-500 uppercase font-bold mb-4 tracking-widest">Bank BCA</p>
                   <p className="text-2xl font-bold text-white mb-2">8880815017</p>
                   <p className="gold-text font-serif text-lg mb-8 italic">a.n Rijal Fauji</p>
                   <button onClick={() => copyToClipboard("8880815017", "B1")} className="px-10 py-3 border border-[#BF953F] rounded-full text-[10px] text-[#BF953F] uppercase font-bold tracking-widest">
                     {copied === "B1" ? "Berhasil Disalin" : "Salin Rekening"}
                   </button>
                </div>
             </div>
          </section>

          {/* SECTION 7: RSVP (KONFIRMASI KEHADIRAN) */}
          <section className="max-w-4xl mx-auto px-6 py-24">
             <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 backdrop-blur-xl">
                <h3 className="text-2xl gold-text font-serif mb-12 uppercase text-center tracking-widest">Konfirmasi Kehadiran</h3>
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-4">Nama Lengkap</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#BF953F] transition-all" placeholder="Nama Anda" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-4">Kehadiran</label>
                      <select className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none appearance-none">
                         <option>Hadir</option>
                         <option>Tidak Dapat Hadir</option>
                      </select>
                   </div>
                   <button onClick={() => window.open('https://wa.me/628?text=KonfirmasiKehadiran')} className="w-full bg-[#BF953F] text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3">
                      <MessageCircle size={18} /> Kirim Via WhatsApp
                   </button>
                </form>
             </div>
          </section>

          {/* SECTION 8: PENUTUP & DOA PENGANTIN */}
          <section className="py-40 text-center px-6">
             <h3 className="text-3xl gold-text font-serif mb-12 uppercase tracking-widest">Doa Pengantin</h3>
             <p className="text-xl md:text-3xl italic text-gray-200 mb-16 font-serif leading-relaxed max-w-4xl mx-auto">
                بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ<br />
                <span className="text-lg block mt-8 gold-text">Barakallahu laka wa baraka ‘alaika wa jama’a bainakuma fii khoir</span>
             </p>
             <div className="mt-32">
                <p className="text-[10px] text-[#BF953F] tracking-[0.8em] uppercase mb-10 font-black">Kami Yang Berbahagia</p>
                <h4 className="text-5xl md:text-8xl gold-text font-serif mb-16">Novi & Rijal</h4>
                <div className="inline-block px-12 py-4 border-y border-[#BF953F]/30 italic text-gray-500 text-[10px] tracking-[0.5em]">
                   DIGITAL INVITATION BY @GRENTRAVLT_
                </div>
             </div>
          </section>

        </motion.div>
      )}

      <style jsx global>{`
        .gold-text {
          background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  );
}

export default function WeddingPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center gold-text text-xl">Memuat Undangan Mewah...</div>}>
      <InvitationContent />
    </Suspense>
  );
}
