"use client"

import { useRef } from "react"
import { TimelineContent } from "@/components/ui/timeline-animation"
// Link not used
import StarBorder from "@/components/ui/star-border"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black">
      {/* Dark Red Shadow Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 120% 100% at 50% 40%, rgba(189, 0, 0, 0.3), transparent 70%), #000000",
        }}
      />
      
      {/* Black Vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16" ref={heroRef}>
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
