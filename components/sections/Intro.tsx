import { hero } from "@/lib/content";

// A short centred greeting that fades out to reveal the hero. Pure CSS, so it also
// clears itself without JavaScript, and it is skipped under reduced motion.
export function Intro() {
  return (
    <div aria-hidden="true" className="intro fixed inset-0 z-[70] grid place-items-center bg-ground">
      <p className="intro-text text-[15px] tracking-tight">
        <span className="text-muted">{hero.intro[0]} </span>
        <span>{hero.intro[1]}</span>
      </p>
      <style>{`
        .intro { animation: intro-out .6s 1.35s both ease-in; }
        .intro-text { animation: intro-text 1.35s both var(--ease-out-soft); }
        @keyframes intro-text { 0% { opacity: 0; filter: blur(6px) } 30%, 75% { opacity: 1; filter: blur(0) } 100% { opacity: 0 } }
        @keyframes intro-out { to { opacity: 0; visibility: hidden } }
        @media (prefers-reduced-motion: reduce) { .intro { display: none } }
      `}</style>
    </div>
  );
}
