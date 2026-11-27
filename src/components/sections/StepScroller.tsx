"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductStep } from "@/lib/content/types";
import { StepStage } from "@/components/ui/StepStage";

type Props = {
  steps: ProductStep[];
  /** Short promises listed under the stage. */
  rules?: string[];
  /** Level of the step headings, so they nest under the section's own headings. */
  headingLevel?: "h3" | "h4";
};

// Steps scroll by on the left while a sticky stage on the right plays each step's scene.
// On small screens every step carries its own stage instead.
export function StepScroller({ steps, rules = [], headingLevel: Heading = "h3" }: Props) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const scenes = useMemo(() => steps.map((s) => s.scene), [steps]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps]);

  return (
    <div className="grid gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
      <ol>
        {steps.map((step, i) => (
          <li
            key={step.title}
            data-step={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-current={active === i ? "step" : undefined}
            className="flex flex-col justify-center py-10 lg:min-h-[58vh]"
          >
            <p className="eyebrow">
              Step {i + 1} of {steps.length}
            </p>
            <Heading className={`mt-3 text-split font-medium transition-colors duration-500 ${active === i ? "text-ink" : "lg:text-ink/25"}`}>
              {step.title}
            </Heading>
            <p className={`mt-4 max-w-md transition-colors duration-500 ${active === i ? "text-ink/65" : "lg:text-ink/25"}`}>{step.body}</p>
            <div className="card-soft mt-8 w-full max-w-[520px] rounded-[24px] p-4 lg:hidden">
              <StepStage scenes={[step.scene]} active={0} />
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <div className="card-soft sticky top-[max(6rem,calc(50vh-290px))] rounded-[28px] p-6">
          <StepStage scenes={scenes} active={active} />
          {rules.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2 px-2 pb-1 text-sm text-ink/60">
              {rules.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
