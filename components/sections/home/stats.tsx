"use client";

import { animate, motion, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";

// 1. AnimatedCounter Helper Component
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(val) {
          if (ref.current) {
            ref.current.textContent = prefix + val.toFixed(decimals) + suffix;
          }
        },
      });
    }
  }, [inView, value, prefix, suffix, decimals]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

// 2. Typewriter Reveal Component
interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

export function Typewriter({
  text,
  delay = 0,
  speed = 0.015,
  className = "",
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {text.split("").map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={childVariants}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 3. StatsSection Component
export function StatsSection() {
  // SVG mask URI for custom logo mark
  const logoSvgDataUri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-135 -77 556 556'%3E%3Cpath d='M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z' fill='black'/%3E%3C/svg%3E")`;

  const maskStyles = {
    WebkitMaskImage: logoSvgDataUri,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskImage: logoSvgDataUri,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
  };

  const leftColVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const statsData = [
    { value: 500, suffix: "K+", label: "Acres Harvested Annually" },
    { value: 99.8, decimals: 1, suffix: "%", label: "Crop Recovery Rate" },
    { value: 50, suffix: "+", label: "Modern Combines Deployed" },
    { value: 15, suffix: "+", label: "Crop Varieties Supported" },
    { value: 24, suffix: "/7", label: "Uptime During Season" },
  ];

  return (
    <section
      id="stats"
      className="bg-background text-text-primary py-8 md:py-24 pt-18 px-6 md:px-12 lg:px-30 w-full overflow-hidden"
    >
      <div className="w-full max-w-352 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-40 items-stretch">
          {/* Left Column (Stats & Typography) */}
          <motion.div
            className="flex-1 flex flex-col justify-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={leftColVariants}
          >
            {/* Fluid Typewriter Heading */}
            <h2 className="text-[clamp(1.55rem,4vw,3.2rem)] font-semibold tracking-tight mb-md leading-[1.1] w-147.5 max-w-full text-text-primary">
              <Typewriter text="Powering Harvests" delay={0} speed={0.012} />
              <br />
              <Typewriter text="that " delay={0.25} speed={0.012} />
              <span className="font-dm-serif italic font-normal text-text-secondary">
                <Typewriter
                  text="Maximize Your Yield"
                  delay={0.35}
                  speed={0.012}
                />
              </span>
            </h2>

            {/* Subtitle description */}
            <p className="text-[16px] md:text-[18px] text-text-secondary leading-relaxed font-light max-w-188 mb-lg">
              <Typewriter
                text="For over a decade, the region's most demanding agricultural operations have relied on our modern machinery and skilled crews to secure their crops efficiently and reduce loss."
                delay={0.1}
                speed={0.012}
              />
            </p>

            {/* Animated Numbers Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-[max-content_max-content] gap-sx md:gap-x-4 lg:gap-x-8"
              variants={gridVariants}
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col"
                  variants={statItemVariants}
                >
                  <span className="text-[28px] md:text-[36px] lg:text-[48px] font-semibold tracking-tight mb-1 text-text-primary font-serif">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column (Logo-Masked Video) */}
          <div className="flex absolute right-0 justify-center lg:justify-end items-center shrink-0 lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1.2 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
              className="w-full max-w-42.5 lg:max-w-none lg:w-full aspect-square origin-center"
              style={maskStyles}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://ik.imagekit.io/favurr/oh_man_this_is_an_under_water.mp4"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
