import { experience } from "@/lib/content";
import { BlurReveal } from "@/components/ui/BlurReveal";

const dots = ["#1fbf86", "#6f8bff", "#f59e0b", "#ff5a3c"];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-title" className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="lg:self-center">
          <p className="eyebrow">Experience</p>
          <BlurReveal id="exp-title" className="mt-4 text-split font-medium">
            Where I&apos;ve shipped.
          </BlurReveal>
          <p className="mt-6 max-w-md text-ink/60">
            Production work on GenAI and backend teams, plus the systems I&apos;m building on my own.
          </p>
        </div>
        <ol className="panel-3d rounded-[28px] p-3 text-white sm:p-4">
          {experience.map((job, i) => (
            <li key={job.org} className="group relative rounded-2xl py-5 pl-11 pr-4 transition-[background,box-shadow] duration-300 hover:bg-[linear-gradient(180deg,#222227,#18181c)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:pr-5">
              <span aria-hidden="true" className="absolute bottom-0 left-[21px] top-0 w-px bg-white/10 group-first:top-7 group-last:bottom-[calc(100%-28px)]" />
              <span
                aria-hidden="true"
                className="absolute left-4 top-[26px] h-3 w-3 rounded-full"
                style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${dots[i % dots.length]} 60%)`, boxShadow: `0 0 12px 2px ${dots[i % dots.length]}99` }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-medium tracking-tight">{job.org}</h3>
                {job.period && <span className="font-mono text-xs text-white/45">{job.period}</span>}
              </div>
              <p className="mt-1 font-mono text-xs text-white/50">{job.role}</p>
              <p className="mt-3 text-sm text-white/70">{job.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
