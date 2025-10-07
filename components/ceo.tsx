"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StarBorder } from "@/components/ui/star-border";
import Image from "next/image";
import { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";

export default function CEO() {
  const timelineRef = useRef<HTMLElement | null>(null);
  return (
    <section id="ceo" ref={timelineRef} className="relative py-28 overflow-hidden">
      {/* ===== Cinematic ambient background (no seam) ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* soft red ambient top washes (theme primary) */}
        <div className="absolute left-1/2 top-0 h-[90vh] w-[120%] -translate-x-1/2 bg-[radial-gradient(60%_45%_at_50%_25%,hsl(var(--primary)/0.22)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 top-12 h-[80vh] w-[110%] -translate-x-1/2 bg-[radial-gradient(80%_65%_at_50%_40%,hsl(var(--primary)/0.12)_0%,transparent_80%)] blur-2xl" />

        {/* soft mid atmospheric vignette — lets the content breathe */}
        <div className="absolute inset-0 bg-[radial-gradient(95%_95%_at_50%_45%,transparent_55%,rgba(0,0,0,0.72)_100%)]" />

        {/* faint grid texture (keeps it premium) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* ===== LONG SMOOTH BOTTOM FADE TO PURE BLACK =====
            This is the key: a tall linear gradient that transitions gradually
            to true black so there is no visible seam with the next section. */}
        <div
          className="absolute inset-x-0 bottom-0"
            style={{
            height: "120vh",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.40) 35%, rgba(0,0,0,0.78) 70%, rgba(0,0,0,0.95) 90%, rgba(0,0,0,1) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* final guaranteed solid black floor to remove any chance of line */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-black" />
      </div>

      {/* ===== Heading ===== */}
      <TimelineContent animationNum={0} timelineRef={timelineRef} className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-tight hero-glow">
          <span className="font-sans text-white">Our</span>{" "}
          <span className="scotch-emph text-primary">CEO</span>
        </h2>
        <div className="mx-auto mt-4 h-[2px] w-28 rounded-full bg-[linear-gradient(90deg,transparent,hsla(var(--primary),0.9),transparent)]" />
      </TimelineContent>

      {/* ===== Content ===== */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <div className="space-y-5">
          <TimelineContent as="span" animationNum={1} timelineRef={timelineRef} className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[hsl(var(--primary)/0.9)] px-3 py-1 rounded-full border border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.08)]">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" /> Founder & CEO
          </TimelineContent>

          <TimelineContent as="h3" animationNum={2} timelineRef={timelineRef} className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            Alwan Khan
          </TimelineContent>

          <TimelineContent as="p" animationNum={3} timelineRef={timelineRef} className="text-lg text-gray-100/95 max-w-xl leading-relaxed">
            We craft content that <span className="scotch-emph">earns trust</span> and
            turns attention into measurable growth. Strategy, creative and
            consistency—nothing extra.
          </TimelineContent>

          <TimelineContent as="blockquote" animationNum={4} timelineRef={timelineRef} className="relative pl-4 border-l-2 border-[hsl(var(--primary)/0.35)] text-white/90">
            <span className="scotch-emph">
              “Consistency beats virality. Systems win.”
            </span>
          </TimelineContent>

          <TimelineContent animationNum={5} timelineRef={timelineRef} className="flex items-center gap-3 pt-2">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <StarBorder as={Link} href="https://calendly.com/alwankhan" target="_blank" rel="noopener noreferrer">
                <span className="scotch-emph text-white">Book a call</span>
              </StarBorder>
            </motion.div>
          <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <StarBorder as={Link} href="#work">
                <span className="scotch-emph text-white">View work</span>
              </StarBorder>
            </motion.div>
          </TimelineContent>

          <TimelineContent animationNum={6} timelineRef={timelineRef} className="grid grid-cols-3 gap-6 pt-2">
            {[
              { n: "100+", l: "Projects" },
              { n: "15+", l: "Clients" },
              { n: "2+", l: "Years Exp." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white tracking-[-0.02em] hero-glow">
                  {s.n}
                </div>
                <div className="mt-1 text-xs md:text-sm text-gray-400 uppercase tracking-wide">
                  {s.l}
                </div>
              </div>
            ))}
          </TimelineContent>
        </div>

        {/* Right: Portrait */}
        <TimelineContent animationNum={1} timelineRef={timelineRef} className="relative justify-center items-center flex">
          <div className="absolute -inset-10 rounded-[28px] bg-[radial-gradient(40%_50%_at_50%_50%,hsl(var(--primary)/0.18),transparent_70%)] blur-xl" />
          <div className="relative rounded-[22px] overflow-hidden border border-white/10 shadow-[0_8px_60px_rgba(255,0,20,0.12)]">
            <Image
              src="/images/ceo.png"
              alt="CEO portrait"
              width={420}
              height={520}
              className="w-80 h-[28rem] object-cover"
              priority
            />
            {/* dark red shine emanating from portrait */}
            <div className="pointer-events-none absolute inset-0">
              {/* stronger bottom glow */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[180%] h-[80%] blur-[90px] opacity-70 bg-[radial-gradient(60%_70%_at_50%_85%,hsl(var(--primary)/0.55),transparent_70%)]" />
              {/* complementary top rim light */}
              <div className="absolute -top-10 right-1/2 translate-x-1/2 w-[150%] h-[55%] blur-[70px] opacity-45 bg-[radial-gradient(55%_55%_at_50%_15%,hsl(var(--primary)/0.28),transparent_70%)]" />
              {/* subtle lateral sweep */}
              <div className="absolute inset-y-1/3 -left-20 w-[60%] blur-[80px] opacity-30 bg-[radial-gradient(45%_55%_at_50%_50%,hsl(var(--primary)/0.22),transparent_70%)]" />
            </div>
          </div>
        </TimelineContent>
      </div>
    </section>
  );
}
