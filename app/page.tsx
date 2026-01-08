'use client';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MailOpen, MapPin, Heart, Volume2, VolumeX, Navigation, Calendar, Copy, Check, Gift } from 'lucide-react';

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // LOGIKA COUNTDOWN
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

  const { scrollYProgress } = useScroll();

  const openInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) audioRef.current.play();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <audio ref={audioRef} loop src="/wedding.mp3" />

      {/* 1. COVER / LANDING PAGE */}
      <AnimatePresence>
        {!isOpen && (
          <motion.section
            exit={{ opacity: 0, y: -100 } as any}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: 'url("/bg-wedding.jpg")' }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 text-center px-6">
              <motion.p initial={{ opacity: 0 } as any} animate={{ opacity: 1 } as any} className="gold-text tracking-[0.3em] text-xs mb-4">THE WEDDING OF</motion.p>
              <h1 className="text-5xl md:text-7xl font-serif gold-text mb-8">Novi & Rijal</h1>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <p className="text-gray-300 text-sm mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <h2 className="text-2xl font-serif mb-6">{guestName}</h2>
                <button onClick={openInvitation} className="bg-[#BF953F] text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform">
                  <MailOpen size={18} /> Buka Undangan
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 2. KONTEN UTAMA */}
      {isOpen && (
        <div className="relative">
          {/* Musik Kontrol */}
          <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} 
            className="fixed bottom-6 right-6 z-50 p-3 bg-[#BF953F] rounded-full text-black shadow-xl">
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Progress Bar */}
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#BF953F] z-[100] origin-left" style={{ scaleX: scrollYProgress } as any} />

          {/* HERO SECTION */}
          <section className="h-screen flex items-center justify-center text-center px-6 bg-fixed bg-cover" style={{ backgroundImage: 'url("/bg-wedding.jpg")' }}>
             <div className="absolute inset-0 bg-black/50" />
             <div className="relative">
                <motion.h2 initial={{ y: 50 } as any} whileInView={{ y: 0 } as any} className="text-6xl md:text-8xl font-serif gold-text">Novi & Rijal</motion.h2>
                <p className="mt-4 tracking-[0.5em]">10 JANUARI 2026</p>
             </div>
          </section>

          {/* KATA SAMBUTAN (AR-RUM) */}
          <section className="py-20 px-6 text-center max-w-4xl mx-auto">
            <Heart className="mx-auto text-[#BF953F] mb-6" />
            <h3 className="font-serif text-2xl mb-6 gold-text italic">Assalamu’alaikum Warahmatullahi Wabarakatuh</h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              Maha suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. 
              Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan dalam ikatan pernikahan.
            </p>
            <div className="p-6 border-y border-[#BF953F]/30">
              <p className="italic text-lg font-serif">
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
              </p>
              <p className="mt-4 text-xs gold-text">(QS. AR-RUM: 21)</p>
            </div>
          </section>

          {/* PROFIL MEMPELAI */}
          <section className="py-20 px-6 grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
             <div className="text-center">
                <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#BF953F] overflow-hidden mb-6">
                   <img src="/mempelai-wanita.jpg" alt="Novi" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-serif gold-text">Novi Salsabilah</h3>
                <p className="text-sm text-gray-400 mt-2">Putri dari Bapak Fulan & Ibu Fulanah</p>
             </div>
             <div className="text-center">
                <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#BF953F] overflow-hidden mb-6">
                   <img src="/mempelai-pria.jpg" alt="Rijal" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-serif gold-text">Rijal Fauji</h3>
                <p className="text-sm text-gray-400 mt-2">Putra dari Bapak Fulan & Ibu Fulanah</p>
             </div>
          </section>

          {/* GRID FOTO / GALLERY */}
          <section className="py-20 bg-black/40">
            <div className="container mx-auto px-4">
              <h3 className="text-center font-serif text-4xl gold-text mb-12">Momen Bahagia</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 } as any} className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                    <img src={`/gallery-${i}.jpg`} className="w-full h-full object-cover" alt="Gallery" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ACARA & LOKASI */}
          <section className="py-20 px-6 text-center">
            <div className="bg-[#1a1a1a] p-10 rounded-[40px] border border-[#BF953F]/20 max-w-3xl mx-auto">
               <Calendar className="mx-auto text-[#BF953F] mb-4" />
               <h3 className="text-3xl font-serif gold-text mb-8">Akad & Resepsi</h3>
               <p className="text-xl mb-2">Sabtu, 10 Januari 2026</p>
               <p className="text-gray-400 mb-8">08:00 WIB - Selesai</p>
               <div className="h-64 rounded-2xl overflow-hidden mb-8 border border-white/10">
                 <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style={{ border: 0 }}></iframe>
               </div>
               <a href="#" className="inline-flex items-center gap-2 bg-[#BF953F] text-black px-10 py-3 rounded-full font-bold">
                 <Navigation size={18} /> Buka Google Maps
               </a>
            </div>
          </section>

          {/* NOMOR REKENING (WEDDING GIFT) */}
          <section className="py-20 px-6 text-center bg-[#0f0f0f]">
            <Gift className="mx-auto text-[#BF953F] mb-4" />
            <h3 className="text-3xl font-serif gold-text mb-4">Wedding Gift</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm">Doa restu Anda merupakan kado terindah bagi kami. Namun jika ingin memberi tanda kasih, silakan melalui:</p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Rekening 1 */}
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 relative">
                <img src="/bank-seabank.png" className="h-8 mx-auto mb-4 opacity-80" alt="SeaBank" />
                <p className="text-sm text-gray-400">SEABANK</p>
                <p className="text-xl font-bold my-2 tracking-wider">901234567890</p>
                <p className="text-xs uppercase gold-text">A.n Novi Salsabilah</p>
                <button onClick={() => copyToClipboard('901234567890', 'seabank')} className="mt-4 flex items-center gap-2 mx-auto text-xs bg-white/10 px-4 py-2 rounded-lg">
                  {copied === 'seabank' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 
                  {copied === 'seabank' ? 'Berhasil Salin' : 'Salin Rekening'}
                </button>
              </div>

              {/* Rekening 2 */}
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <img src="/bank-bca.png" className="h-8 mx-auto mb-4 opacity-80" alt="BCA" />
                <p className="text-sm text-gray-400">BCA</p>
                <p className="text-xl font-bold my-2 tracking-wider">1234567890</p>
                <p className="text-xs uppercase gold-text">A.n Rijal Fauji</p>
                <button onClick={() => copyToClipboard('1234567890', 'bca')} className="mt-4 flex items-center gap-2 mx-auto text-xs bg-white/10 px-4 py-2 rounded-lg">
                  {copied === 'bca' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 
                  {copied === 'bca' ? 'Berhasil Salin' : 'Salin Rekening'}
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-20 text-center border-t border-white/5">
             <h4 className="font-serif text-4xl gold-text mb-4">Terima Kasih</h4>
             <p className="text-gray-500 text-xs tracking-widest uppercase">Digital Invitation by @grentravlt_</p>
          </footer>
        </div>
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
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <InvitationContent />
    </Suspense>
  );
}
