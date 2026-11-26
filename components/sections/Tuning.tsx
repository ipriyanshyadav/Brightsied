"use client";

import { useId, useMemo, useState } from "react";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { DialIcon, SliderIcon } from "@/components/ui/InlineIcons";

const QUERY = "When are sealed bids opened for evaluation?";
const DOC =
  "Vendors submit quotes through the portal before the RFQ deadline. Every bid is sealed on upload and stored as an encrypted document. Buyers cannot see prices until the deadline passes. Sealed bids are opened automatically at the deadline and moved into evaluation. The opening is logged with a timestamp and the user who triggered it. Late quotes are rejected by the system. Evaluation starts with a comparative statement that normalises units, currency and tax.";

const SIZE_MIN = 6;
const SIZE_MAX = 40;

const STOP = new Set(["when", "are", "for", "the", "and", "a", "is", "to", "with", "by", "of", "at", "into", "on", "as", "be", "it"]);
const stem = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "").replace(/(ed|s)$/, "");
const terms = QUERY.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter((w) => !STOP.has(w));

// A real (if tiny) retrieval demo: chunk the passage by word count, score chunks by
// query-term overlap and highlight the top k. Changing the controls changes the result.
export function Tuning() {
  const [size, setSize] = useState(14);
  const [k, setK] = useState(2);
  const sizeId = useId();

  const { chunks, top } = useMemo(() => {
    const words = DOC.split(" ");
    const out: { text: string; score: number }[] = [];
    for (let i = 0; i < words.length; i += size) {
      const slice = words.slice(i, i + size);
      const stems = new Set(slice.map(stem));
      out.push({ text: slice.join(" "), score: terms.filter((t) => stems.has(stem(t))).length });
    }
    const ranked = out
      .map((c, i) => ({ i, s: c.score }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .slice(0, k)
      .filter((c) => c.s > 0)
      .map((c) => c.i);
    return { chunks: out, top: new Set(ranked) };
  }, [size, k]);

  return (
    <section id="lab" aria-labelledby="tune-title" className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <div className="panel-3d order-2 rounded-[28px] p-4 text-white sm:p-6 lg:order-1">
          <div className="panel-cell grid gap-6 rounded-2xl p-5 sm:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <label htmlFor={sizeId} className="font-mono text-white/70">Chunk size</label>
                <output htmlFor={sizeId} className="font-mono text-white">{size} words</output>
              </div>
              <input
                id={sizeId}
                type="range"
                min={SIZE_MIN}
                max={SIZE_MAX}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="range-3d mt-5 w-full"
                style={{ ["--fill" as string]: `${((size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)) * 100}%` }}
              />
            </div>
            <fieldset>
              <legend className="font-mono text-sm text-white/70">Top-k</legend>
              <div className="mt-3 inline-flex gap-1 rounded-xl bg-[#08080a] p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.06)]">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={k === n}
                    onClick={() => setK(n)}
                    className={`h-9 w-11 rounded-lg font-mono text-sm transition-colors ${
                      k === n
                        ? "bg-[linear-gradient(180deg,#fff,#d9dbe1)] text-ink shadow-[inset_0_1px_0_#fff,0_2px_0_#6b6f78,0_6px_12px_-4px_rgba(0,0,0,0.7)]"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <p className="mt-5 px-1 font-mono text-xs text-white/45">
            query <span className="text-white/90">{QUERY}</span>
          </p>
          <ol className="mt-3 flex flex-col gap-1.5" aria-live="polite">
            {chunks.map((c, i) => {
              const hit = top.has(i);
              return (
                <li
                  key={`${size}-${i}`}
                  className={`flex gap-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed transition-colors duration-300 ${
                    hit ? "lit" : "text-white/40"
                  }`}
                >
                  <span className={`w-4 shrink-0 font-mono text-xs leading-6 ${hit ? "text-[#9fb2ff]" : ""}`}>{c.score}</span>
                  <span>
                    {c.text}
                    {hit && <span className="sr-only"> (retrieved)</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="order-1 lg:sticky lg:top-[32vh] lg:order-2 lg:self-start">
          <p className="eyebrow">Try it</p>
          <BlurReveal id="tune-title" className="mt-4 text-split font-medium">
            Tune retrieval with chunk <DialIcon /> sizes, top-k <SliderIcon /> and re-ranking, then measure what changed.
          </BlurReveal>
          <p className="mt-6 max-w-md text-ink/60">
            The panel matches a question against a short policy passage. The number beside
            each chunk is how many query terms it shares. Production systems use embeddings,
            but the trade-off is the same: small chunks are precise, large ones keep context.
          </p>
        </div>
      </div>
    </section>
  );
}
