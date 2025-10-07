"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Instagram, Linkedin } from "lucide-react";
import RippleGrid from './RippleGrid';
import { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";

export default function Footer() {
  const timelineRef = useRef<HTMLElement | null>(null);
  return (
    <footer ref={timelineRef} className="relative bg-black text-white py-8 px-4 sm:px-6 overflow-hidden">
      {/* RippleGrid as the main background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Solid black fallback to avoid white background if WebGL fails */}
        <div className="absolute inset-0 bg-black pointer-events-none" />
        <RippleGrid
          enableRainbow={false}
          gridColor="#121013"
          rippleIntensity={0.0}
          gridSize={4}
          gridThickness={21}
          fadeDistance={0.2}
          vignetteStrength={5}
          glowIntensity={0.0}
          opacity={9}
          gridRotation={0}
          mouseInteraction={false}
          mouseInteractionRadius={0.2}
        />
      </div>

      {/* Red gradient accent overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-[#5a0d17] to-[#7a0f1b] blur-3xl opacity-20" />

      <div className="relative z-10 max-w-7xl 2xl:max-w-[88rem] mx-auto">
        {/* Main content grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
            >
              <TimelineContent as="h3" animationNum={0} timelineRef={timelineRef} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Alvynex
              </TimelineContent>
                {/* Icons under brand title */}
                <TimelineContent animationNum={1} timelineRef={timelineRef} className="flex items-center gap-4 sm:gap-6">
                  <Link 
                    href="mailto:alwanfx11@gmail.com"
                    aria-label="Email Alvynex"
                    title="Email"
                    className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#5a0d17] to-[#7a0f1b] text-white transition-transform duration-300 hover:scale-110 shadow-lg"
                  >
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                  <Link 
                    href="https://www.instagram.com/alwan.visuals"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#5a0d17] to-[#7a0f1b] text-white transition-transform duration-300 hover:scale-110 shadow-lg"
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                  <Link 
                    href="https://www.linkedin.com/in/alwan-khan-91345a310/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#5a0d17] to-[#7a0f1b] text-white transition-transform duration-300 hover:scale-110 shadow-lg"
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                </TimelineContent>
                {/* Removed brand paragraph and quote as requested */}
          </motion.div>

          {/* Contact section */}
              {/* Second column no longer contains icons; consolidated under brand */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="space-y-6"
              />

          {/* Right-side sections */}
              <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
                className="space-y-3 text-right mt-4 sm:mt-6"
          >
                <TimelineContent as="h4" animationNum={2} timelineRef={timelineRef} className="text-sm sm:text-base font-semibold mt-2 text-[#7a0f1b]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  Sections
                </TimelineContent>
                <TimelineContent as="nav" animationNum={3} timelineRef={timelineRef} className="flex flex-col items-end gap-1.5 sm:gap-2" aria-label="Footer sections" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  <Link href="#work" className="text-[#7a0f1b] hover:text-[#a01422] transition-colors text-sm sm:text-base">Portfolio</Link>
                  <Link href="#pricing" className="text-[#7a0f1b] hover:text-[#a01422] transition-colors text-sm sm:text-base">How It Works</Link>
                </TimelineContent>
          </motion.div>
        </div>

            {/* Bottom section */}
            <TimelineContent animationNum={4} timelineRef={timelineRef} className="mt-8 pt-4">
              <div className="flex justify-center items-center">
                <p 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                >
                  © 2025 Alvynex. All rights reserved.
                </p>
              </div>
              <div className="mt-2 flex justify-center items-center gap-2 text-gray-400 text-xs" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>|</span>
                <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </div>
            </TimelineContent>
      </div>
    </footer>
  );
}