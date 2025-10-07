// components/Process.tsx
"use client";

import React, { useEffect, useRef } from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/spotlight-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Strategy",
    text: "A tailored roadmap that defines your audience, sets content pillars, and creates a posting plan designed to get inbound leads.",
    icon: "/images/chess.png",
  },
  {
    number: "02",
    title: "Scripting",
    text: "Persuasive scripts designed to capture attention, communicate your message clearly, and convert viewers into leads.",
    icon: "/images/scripting.png",
  },
  {
    number: "03",
    title: "Editing",
    text: "High-quality edits optimized to hook viewers, increase retention, and present your brand at a professional standard.",
    icon: "/images/editing.png",
  },
];

export default function Process(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;
    if (typeof window === "undefined") return;

    // ✅ Safely read primary color from CSS variable
    const root = getComputedStyle(document.documentElement);
    const primary =
      root.getPropertyValue("--primary").trim() || "rgb(220,38,38)"; // fallback red-600

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLDivElement>(".process-step");

      if (!panels || panels.length <= 1) return;

      const totalScroll = (panels.length - 1) * window.innerWidth;

      gsap.set(panels, { willChange: "transform" });

      panels.forEach((panel, index) => {
        gsap.set(panel, { xPercent: 100 * index });
      });

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScroll * 2}`, // Much more scroll distance for full control
          pin: true,
          scrub: 3, // Much slower, manual scrolling
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }

            const dots = document.querySelectorAll(".dot");
            if (!dots.length) return;

            const activeIndex = Math.round(self.progress * (panels.length - 1));

            // reset all dots
            gsap.to(dots, {
              scale: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
              duration: 0.3,
              ease: "power2.out",
            });

            // highlight active dot
            if (dots[activeIndex]) {
              gsap.to(dots[activeIndex], {
                scale: 1.5,
                backgroundColor: primary,
                duration: 0.4,
                ease: "power2.out",
              });
            }
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black text-white"
      aria-label="Our Process"
    >
      {/* Progress bar */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-1 bg-white/5">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-primary/70 shadow-[0_0_22px_theme(colors.primary.DEFAULT/.7)]"
        />
      </div>

      {/* Heading */}
      <div className="absolute top-16 left-0 right-0 z-20 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="scotch-emph text-primary text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em]"
        >
          Process
        </motion.h2>
      </div>

      {/* Horizontal panels */}
      <div
        ref={wrapperRef}
        className="flex h-full pt-28"
        style={{ width: `${steps.length * 100}vw` }}
      >
        {steps.map((s, i) => (
          <div
            key={s.number}
            className="process-step relative flex h-full w-screen items-center justify-center px-1"
          >
            {/* Background number */}
            <span className="absolute inset-0 flex items-center justify-center font-bold text-white/5 text-[22vw] md:text-[18rem] select-none pointer-events-none -z-0">
              {s.number}
            </span>

            {/* Cinematic Card */}
            <SpotlightCard className="relative z-10 w-full max-w-[600px] bg-gradient-to-br from-neutral-950/95 to-neutral-900/90 border border-neutral-700/60 backdrop-blur-xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_40px_100px_-12px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08),0_0_50px_rgba(139,69,19,0.15)] transition-all duration-1000 p-4 md:p-6 rounded-3xl text-center group hover:scale-[1.01]">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1.3,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="mb-4 text-xs md:text-sm uppercase tracking-[0.2em] text-primary/80">
                  Step {s.number}
                </div>

                {/* Icon */}
                {s.icon && (
                  <div className="flex justify-center mb-3">
                    <div className="p-2 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-700">
                      <Image
                        src={s.icon}
                        alt={`${s.title} icon`}
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-700">
                  {s.title}
                </h3>

                {/* Text */}
                <p className="mx-auto max-w-sm text-gray-300 text-sm md:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-700">
                  {s.text}
                </p>
              </motion.div>
            </SpotlightCard>
          </div>
        ))}
      </div>

      {/* Bottom dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className="dot h-2 w-6 rounded-full bg-white/15 transition-all duration-500"
          />
        ))}
      </div>
    </section>
  );
}
