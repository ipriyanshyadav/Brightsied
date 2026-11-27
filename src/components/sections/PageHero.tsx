import type { TileKind } from "@/components/ui/GlossyTile";
import { LiveTile } from "@/components/ui/LiveTile";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Three tiles floating beside the copy; omitted on text-only pages. */
  tiles?: [TileKind, TileKind, TileKind];
  /** "dark" gives product pages a full-bleed, spotlight look. */
  tone?: "light" | "dark";
  children?: React.ReactNode;
};

// The opening block of every inner page.
export function PageHero({ eyebrow, title, intro, tiles, tone = "light", children }: Props) {
  const dark = tone === "dark";
  return (
    <section
      className={`relative isolate overflow-hidden px-4 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44 ${
        dark ? "panel-3d rounded-b-[40px] text-white" : "bg-[linear-gradient(180deg,#e6e7eb_0%,#f4f4f4_100%)]"
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora left-[4%] top-[8%] h-[300px] w-[360px] bg-[#7f9bff] opacity-25" />
        <div className={`aurora right-[6%] top-[20%] h-[260px] w-[320px] bg-[#b69bff] ${dark ? "opacity-15" : "opacity-20"}`} />
        {!dark && <div className="dot-grid absolute inset-0" />}
      </div>
      <div className={`mx-auto grid max-w-[1180px] items-center gap-12 ${tiles ? "lg:grid-cols-[7fr_5fr]" : ""}`}>
        <div>
          <p className={`eyebrow ${dark ? "text-white/45" : ""}`}>{eyebrow}</p>
          <h1 className="mt-4 max-w-[20ch] text-[clamp(2.4rem,5.2vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            {title}
          </h1>
          {intro && <p className={`mt-6 max-w-[58ch] text-base leading-relaxed sm:text-lg ${dark ? "text-white/60" : "text-ink/65"}`}>{intro}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {tiles && (
          <div aria-hidden="true" className="relative mx-auto aspect-[5/4] w-full max-w-[460px]">
            <div className={`absolute bottom-[10%] left-1/2 h-[10%] w-[70%] -translate-x-1/2 rounded-[50%] blur-2xl ${dark ? "bg-black/50" : "bg-black/20"}`} />
            <LiveTile kind={tiles[0]} rotate={-10} sizes="(min-width: 1024px) 200px, 40vw" className="float-y absolute left-[6%] top-[14%] w-[34%]" />
            <LiveTile kind={tiles[1]} rotate={4} sizes="(min-width: 1024px) 230px, 45vw" className="float-y absolute left-[34%] top-[34%] w-[38%] [animation-delay:-3s]" />
            <LiveTile kind={tiles[2]} rotate={12} sizes="(min-width: 1024px) 170px, 34vw" className="float-y absolute right-[4%] top-[8%] w-[27%] [animation-delay:-5s]" />
          </div>
        )}
      </div>
    </section>
  );
}
