"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import dynamic from "next/dynamic";
const SparklesComp = dynamic(
  () => import("@/components/ui/sparkles").then(m => m.Sparkles),
  { ssr: false }
);
import { TimelineContent } from "@/components/ui/timeline-animation";
// import {VerticalCutReveal} from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Strategy",
    description:
      "A tailored roadmap that defines your audience, sets content pillars, and creates a posting plan designed to get inbound leads.",
    price: 12,
    yearlyPrice: 99,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    icon: "/images/chess.png",
  },
  {
    name: "Scripting",
    description:
      "Persuasive scripts designed to capture attention, communicate your message clearly, and convert viewers into leads.",
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    icon: "/images/scripting.png",
    includes: [
     
    ],
  },
  {
    name: "Editing",
    description:
      "High-quality edits optimized to hook viewers, increase retention, and present your brand at a professional standard.",
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    icon: "/images/editing.png",
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-[rgba(90,13,23,0.8)] border-[#5a0d17] bg-gradient-to-t from-[#5a0d17] to-[#7a0f1b]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full  rounded-full border-4 shadow-sm shadow-[rgba(90,13,23,0.8)] border-[#5a0d17] bg-gradient-to-t from-[#5a0d17] to-[#7a0f1b]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection6() {
  const [isYearly, setIsYearly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
  }, []);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      id="pricing"
      className="min-h-screen w-full relative bg-black overflow-hidden"
      ref={pricingRef}
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {!isMobile && (
        <TimelineContent
          animationNum={4}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
        >
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
          <SparklesComp
            density={1800}
            direction="bottom"
            speed={1}
            color="var(--sparkles-color)"
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          />
        </TimelineContent>
      )}
      {/* Subtle black vignette to soften red ambient */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(95%_95%_at_50%_40%,transparent_55%,rgba(0,0,0,0.92)_100%)]" />
      {/* Top edge fade to black */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 z-10 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="framer-1i5axl2">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #5a0d17",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 1"
          ></div>
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #5a0d17",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 2"
          ></div>
        </div>
      </TimelineContent>

      {/* Heading/subtext (like contact) */}
      <article className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 pt-16 sm:pt-20 md:pt-24 lg:pt-28 max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-3 sm:space-y-4 relative z-50 px-4 sm:px-6 lg:px-8">
        <TimelineContent animationNum={0} timelineRef={pricingRef}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-helvetica text-white hero-glow tracking-[-0.02em]">
            The <span className="scotch-emph !text-white">Power</span> of Process
        </h2>
        </TimelineContent>
        <TimelineContent animationNum={1} timelineRef={pricingRef}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-[-0.01em] scotch-emph text-primary text-center">
            You perform. We perfect.
          </p>
        </TimelineContent>
      </article>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #5a0d17 0%, transparent 70%)
      `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl lg:max-w-7xl xl:max-w-8xl gap-4 sm:gap-6 lg:gap-8 py-6 sm:py-8 lg:py-12 mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className="relative text-white border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 h-full rounded-2xl sm:rounded-3xl"
            >
              <CardHeader className="text-center p-4 sm:p-6 lg:p-8">
                {/* Step button at the top */}
                <div className="mb-4 sm:mb-6">
                  <button
                    className="w-full p-2 sm:p-3 lg:p-4 text-sm sm:text-base lg:text-lg xl:text-xl rounded-xl bg-gradient-to-t from-black to-[#5a0d17] border border-[#5a0d17] text-white font-helvetica"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {`Step ${index + 1}`}
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2 sm:mb-4 text-center font-helvetica text-white">{plan.name}</h3>
                </div>
                {"icon" in plan && (
                  <div className="mt-2 sm:mt-4 flex justify-center">
                    <Image 
                      src={(plan as unknown as { icon: string }).icon}
                      alt={plan.name} 
                      width={48} 
                      height={48} 
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-lg" 
                    />
                </div>
                )}
                {/* Price removed per request */}
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-white mb-4 sm:mb-6 scotch-emph text-center leading-relaxed px-2 sm:px-0">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Feature list removed per request */}
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
