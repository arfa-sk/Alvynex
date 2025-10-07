'use client';

// import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TimelineContent } from '@/components/ui/timeline-animation';

// Playback manager: allow up to 2 visible long-form videos to play smoothly
const videoPool = new Set<HTMLVideoElement>();
const videoState = new Map<HTMLVideoElement, { intersecting: boolean }>();
function registerVideo(el: HTMLVideoElement) {
  videoPool.add(el);
  videoState.set(el, { intersecting: false });
}
function unregisterVideo(el: HTMLVideoElement) {
  videoPool.delete(el);
  videoState.delete(el);
}
function enforcePlayback(limit: number = 2) {
  const visibles = Array.from(videoPool).filter(v => videoState.get(v)?.intersecting);
  const centerY = window.innerHeight / 2;
  const sorted = visibles
    .map(v => { const r = v.getBoundingClientRect(); return { v, d: Math.abs(r.top + r.height / 2 - centerY) }; })
    .sort((a, b) => a.d - b.d)
    .map(x => x.v);
  const allow = new Set(sorted.slice(0, limit));
  for (const v of videoPool) {
    if (allow.has(v)) {
      try { v.play().catch(() => {}); } catch {}
    } else {
      try { v.pause(); } catch {}
    }
  }
}
import CircularGallery from '@/components/CircularGallery';

export default function Work() {
  const timelineRef = useRef<HTMLElement | null>(null);
  // Preload videos on mobile to reduce first-play latency
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    const preheatSources: string[] = [];
    // Collect both long-form and short-form sources
    preheatSources.push('/videos/lf1.mp4','/videos/lf2.mp4','/videos/lf3.mp4','/videos/lf4.mp4');
    preheatSources.push('/videos/sf1.mp4','/videos/sf3.mp4','/videos/sf2.mp4','/videos/sf6.mp4','/videos/sf5.mp4','/videos/sf4.mp4');
    const warmers: HTMLVideoElement[] = preheatSources.map(src => {
      const v = document.createElement('video');
      v.src = src;
      v.muted = true;
      v.setAttribute('muted','');
      (v as HTMLVideoElement & { playsInline?: boolean }).playsInline = true;
      v.setAttribute('playsinline','');
      v.preload = 'auto';
      v.crossOrigin = 'anonymous';
      try { v.load(); } catch {}
      return v;
    });
    return () => {
      warmers.forEach(v => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch {} });
    };
  }, []);
  // ====== VIDEO LISTS ======
  const longForm: { src: string; title: string; tags: string[] }[] = [
    { src: 'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841745/lf1_qrheog.mp4', title: "Here's Why America Will Collapse In Less Than 50 Years", tags: ['Scripting', 'Ideation', 'Editing'] },
    { src: 'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841705/lf2_p1osvq.mp4', title: "This Scalping Strategy Made Me $28,000 in 30 Days!", tags: ['Scripting', 'Ideation', 'Editing', 'SEO'] },
    { src: 'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759842295/lf3_cybkdc.mp4', title: 'The Guy Behind Anime Blades... (Organic Drop Shipping)', tags: ['Ideation', 'Editing', 'SEO', 'Thumbnails'] },
    { src: 'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841869/lf4_rh919j.mp4', title: 'Organic Dropshipping Masterclass (6+ Hour FREE COURSE)', tags: ['Ideation', 'Editing', 'Thumbnails'] },
  ];

  const shortForm = [
    'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841723/sf1_bpyhc8.mp4',
    'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759844180/sf3_qnnlut.mp4',
    'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841931/sf2_fqr6p0.mp4',
    'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841799/sf6_e2mtpq.mp4',
    'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841729/sf5_agarjy.mp4',
    'https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759843883/sf4_k9po6n.mp4',
  ];

  return (
    <section id="work" ref={timelineRef} className="bg-black text-white flex flex-col items-center py-14 sm:py-16 md:py-20 2xl:py-28 overflow-hidden">
      {/* === TITLE === */}
      <TimelineContent animationNum={0} timelineRef={timelineRef} className="text-center px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold tracking-[-0.02em] leading-tight hero-glow">
          <span className="font-sans text-white">Our</span>{' '}
          <span className="scotch-emph text-primary">Portfolio</span>
        </h2>
        {/* decorative line removed per request */}
        <p className="text-gray-100 text-base sm:text-lg md:text-xl mt-3 md:mt-4 tracking-[-0.01em] leading-snug hero-glow">
        Crafting visuals that move hearts and build brands
        </p>
      </TimelineContent>

      {/* === LONG-FORM SHOWCASE (2x2) === */}
      <TimelineContent animationNum={1} timelineRef={timelineRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 2xl:gap-10 max-w-6xl xl:max-w-7xl 2xl:max-w-[88rem] mx-auto mt-10 sm:mt-14 md:mt-16 px-4 sm:px-6">
        {longForm.map((item, i) => (
          <LongFormCard key={i} src={item.src} title={item.title} tags={item.tags} timelineRef={timelineRef} itemIndex={i} />
        ))}
      </TimelineContent>

      {/* === SHORT-FORM REELS (CircularGallery) === */}
      <TimelineContent animationNum={2} timelineRef={timelineRef} className="w-full h-[80vh] mt-24">
        <CircularGallery
          items={shortForm.map((src, i) => ({
            image: src,
            text: `Short Reel ${i + 1}`,
          }))}
          bend={3}
          textColor="#fff"
          borderRadius={0.08}
        />
      </TimelineContent>
    </section>
  );
}

function LongFormCard({ src, title, tags, timelineRef, itemIndex = 0 }: { src: string; title: string; tags: string[]; timelineRef?: React.RefObject<HTMLElement | null>; itemIndex?: number }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    registerVideo(el);
    
    const onCanPlay = () => { 
      setReady(true); 
      enforcePlayback(2); 
    };
    
    const onLoadedData = () => {
      setReady(true);
      try {
        if (el.currentTime < 0.2) el.currentTime = 0.2;
      } catch {}
    };
    
    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('loadeddata', onLoadedData);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const s = videoState.get(el); 
            if (s) s.intersecting = true; 
            else videoState.set(el, { intersecting: true });
            enforcePlayback(2);
          } else {
            const s = videoState.get(el); 
            if (s) s.intersecting = false; 
            else videoState.set(el, { intersecting: false });
            enforcePlayback(2);
          }
        });
      },
      { threshold: 0.25, rootMargin: (window.innerWidth < 768 ? '600px 0px 600px 0px' : '200px 0px 200px 0px') }
    );
    
    observer.observe(el);
    
    const onScroll = () => enforcePlayback(2);
    const onResize = () => enforcePlayback(2);
    window.addEventListener('scroll', onScroll as unknown as EventListener, { passive: true } as AddEventListenerOptions);
    window.addEventListener('resize', onResize);
    
    // Initial enforcement
    enforcePlayback(2);
    
    return () => {
      observer.disconnect();
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('loadeddata', onLoadedData);
      el.pause();
      unregisterVideo(el);
      window.removeEventListener('scroll', onScroll as unknown as EventListener);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <TimelineContent animationNum={itemIndex + 1} timelineRef={timelineRef as React.RefObject<HTMLElement | null>} className="rounded-2xl sm:rounded-3xl transition-shadow">
      <div className="rounded-2xl sm:rounded-3xl bg-black overflow-hidden">
        {/* Video thumb */}
        <TimelineContent animationNum={(itemIndex + 1) * 2} timelineRef={timelineRef as React.RefObject<HTMLElement | null>} className="relative aspect-video bg-black">
          <video
            ref={ref}
            src={src}
            muted
            loop
            playsInline
            autoPlay
            preload={isMobile ? 'auto' : 'metadata'}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
            style={{ transform: 'translateZ(0)' }}
            onMouseEnter={(e) => { 
              const el = e.currentTarget; 
              const s = videoState.get(el); 
              if (s) s.intersecting = true; 
              else videoState.set(el, { intersecting: true }); 
              enforcePlayback(2); 
            }}
            onMouseLeave={(e) => e.currentTarget.pause()}
            onLoadStart={() => setReady(true)}
            onError={(e) => { 
              console.error('Video load error:', e); 
              setReady(true); 
            }}
          />
          {/* subtle vignette only, feels live */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 pointer-events-none" />
        </TimelineContent>
        {/* Meta */}
        <TimelineContent animationNum={(itemIndex + 1) * 2 + 0.5} timelineRef={timelineRef as React.RefObject<HTMLElement | null>} className="px-3 sm:px-4 pt-4 pb-5">
          <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold leading-snug tracking-[-0.01em] font-sans">
            {title}
          </h3>
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((t, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </TimelineContent>
      </div>
    </TimelineContent>
  );
}
