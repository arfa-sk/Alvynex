"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TimelineContent } from "@/components/ui/timeline-animation";

export default function Contact() {
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Load Calendly embed script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative pt-20 pb-0 px-6 flex flex-col items-center bg-hero-gradient text-white overflow-hidden"
      ref={contactRef}
    >
      {/* Cinematic vignette with ultra-dark blacks */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Main blurred gradient layer */}
        <div className="absolute left-1/2 top-24 h-[70vh] w-[95%] max-w-6xl -translate-x-1/2 rounded-[56px] bg-hero-gradient blur-[38px] opacity-100" />
        {/* Darker maroon radial layers */}
        <div className="absolute left-1/2 top-20 h-[66vh] w-[92%] max-w-5xl -translate-x-1/2 rounded-[56px] blur-[30px] opacity-100 bg-[radial-gradient(40%_35%_at_50%_28%,hsl(var(--primary)/0.8)_0%,transparent_50%),radial-gradient(70%_55%_at_50%_45%,hsl(var(--primary)/0.5)_0%,transparent_65%),radial-gradient(22%_22%_at_50%_32%,hsl(var(--background)/0.85)_0%,transparent_45%)]" />
        {/* Hero vignette */}
        <div className="absolute inset-0 rounded-[56px] bg-hero-vignette" />
         {/* Strong black vignette for dramatic edges */}
         <div className="absolute inset-0 rounded-[56px] opacity-100 bg-[radial-gradient(85%_85%_at_50%_40%,transparent_50%,rgba(0,0,0,1)_100%)]" />
         <div className="absolute inset-0 rounded-[56px] opacity-100 bg-[radial-gradient(95%_95%_at_50%_50%,transparent_60%,rgba(0,0,0,1)_100%)]" />
         {/* Extra dark edge layer for maximum depth */}
         <div className="absolute inset-0 rounded-[56px] opacity-95 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_68%,rgba(0,0,0,1)_100%)]" />
        {/* Top fade to pure black to blend with previous section */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Heading with timeline animation */}
      <div className="relative z-10 max-w-2xl text-center mb-4">
        <TimelineContent animationNum={0} timelineRef={contactRef} className="">
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-tight mb-4 font-sans text-white hero-glow">
            <span className="font-sans text-white hero-glow">Let’s</span>{" "}
            <span className="scotch-emph text-primary">Build</span>{" "}
            <span className="font-sans text-white hero-glow">Something</span>
          </h2>
        </TimelineContent>
        <TimelineContent animationNum={1} timelineRef={contactRef} className="">
          <p className="text-gray-100 md:text-xl tracking-[-0.01em] leading-snug hero-glow drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            Book a free vision call to discuss your goals and craft a plan that
            generates inbound leads and scales your brand.
          </p>
        </TimelineContent>
      </div>

      {/* Calendly embed */}
      <TimelineContent animationNum={2} timelineRef={contactRef} className="relative z-10 mt-10 mb-0 w-full max-w-md md:max-w-lg rounded-3xl overflow-hidden">
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/alwankhan?embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&background_color=000000&text_color=ffffff&primary_color=7a0f1b"
          style={{
            width: "100%",
            height: "560px",
            minWidth: "100px",
            background: "transparent",
            overflow: "visible",
          }}
        />
      </TimelineContent>
    </section>
  );
}
