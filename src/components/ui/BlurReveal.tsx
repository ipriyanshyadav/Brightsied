"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  as?: "h2" | "h3" | "p";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

// Headings sharpen word by word from a soft blur as they scroll into view.
// Text is fully readable without JavaScript and under reduced motion.
export function BlurReveal({ as: Tag = "h2", id, className = "", children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, { type: "words", aria: "auto", wordsClass: "split-word" });
        gsap.from(split.words, {
          opacity: 0.08,
          filter: "blur(10px)",
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 88%", end: "top 45%", scrub: 0.6 },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
