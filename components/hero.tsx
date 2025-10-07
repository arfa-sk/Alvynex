"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { TimelineContent } from "@/components/ui/timeline-animation"
import Link from "next/link"
import StarBorder from "@/components/ui/star-border"

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black">
      {/* Gradient spotlight background behind heading */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Cinematic hero gradient - responsive sizing */}
        <div className="mx-auto mt-14 md:mt-16 h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] w-[90%] sm:w-[92%] md:w-[94%] lg:w-[96%] xl:w-[98%] max-w-6xl lg:max-w-7xl xl:max-w-8xl rounded-[40px] sm:rounded-[48px] md:rounded-[56px] lg:rounded-[64px] xl:rounded-[72px] bg-hero-gradient blur-[20px] sm:blur-[24px] md:blur-[28px] lg:blur-[32px] xl:blur-[36px]"></div>
        {/* Vignette for depth */}
        <div className="absolute inset-0 bg-hero-vignette"></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16" ref={heroRef as any}>
        <TimelineContent animationNum={0} timelineRef={heroRef}>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-[1.02] tracking-tighter hero-glow">
            We create <span className="text-primary scotch-emph">content</span> systems that generate{" "}
            <span className="text-primary scotch-emph">inbound leads</span> &amp;{" "}
            <span className="text-primary scotch-emph">scale</span> your brand.
          </h1>
        </TimelineContent>

        {/* CTA button */}
        <TimelineContent animationNum={1} timelineRef={heroRef} className="mt-8 flex justify-center">
          <StarBorder
            as="a"
            href="https://calendly.com/alwankhan"
            target="_blank"
            rel="noopener noreferrer"
            speed="7s"
            className="hover:scale-105 transition-transform duration-300"
            innerClassName="bg-gradient-to-b from-black to-neutral-900 border-border/40 shadow-lg shadow-black/40 hover:shadow-black/60 transition-all"
          >
            <span className="scotch-emph text-lg md:text-xl text-white">Book Call</span>
          </StarBorder>
        </TimelineContent>
      </div>
    </section>
  )
}
