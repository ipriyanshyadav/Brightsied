"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";

function Roll({ label }: { label: string }) {
  return (
    <span className="roll">
      <span>{label}</span>
      <span aria-hidden="true">{label}</span>
    </span>
  );
}

// Floating pill nav. Past the hero, the links fold away and leave the name and a ⋮ button,
// which opens them again. On small screens the ⋮ button opens a dropdown panel.
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 140;
      setScrolled(s);
      if (!s) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  const linksShown = !scrolled || open;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      <nav aria-label="Main" className="mx-auto flex max-w-[1180px] items-start justify-between gap-3">
        <div ref={panelRef} className="relative">
          <div className="glass flex items-center rounded-2xl py-1.5 pl-4 pr-1.5">
            <a href="#top" className="mr-3 text-[17px] font-extrabold italic tracking-[-0.04em]" onClick={() => setOpen(false)}>
              priyansh<span className="text-blue">.</span>
            </a>

            <div
              className={`hidden overflow-hidden transition-[grid-template-columns,opacity] duration-500 ease-[var(--ease-out-soft)] md:grid ${
                linksShown ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
              }`}
              aria-hidden={!linksShown}
            >
              <ul className="flex min-w-0 items-center gap-0.5 whitespace-nowrap text-[13px]">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      tabIndex={linksShown ? 0 : -1}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2.5 py-1.5 text-ink/80 transition-colors hover:bg-black/5 hover:text-ink"
                    >
                      <Roll label={item.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="nav-panel"
              onClick={() => setOpen((v) => !v)}
              className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-black/5 ${
                scrolled ? "md:grid" : "md:hidden"
              }`}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <svg width="4" height="14" viewBox="0 0 4 14" aria-hidden="true">
                {[2, 7, 12].map((cy) => (
                  <circle key={cy} cx="2" cy={cy} r="1.5" fill="currentColor" />
                ))}
              </svg>
            </button>
          </div>

          {/* Small screens: dropdown panel */}
          <div
            id="nav-panel"
            hidden={!open}
            className="glass absolute left-0 top-[calc(100%+8px)] w-[min(86vw,340px)] rounded-2xl p-2 md:hidden"
          >
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 transition-colors hover:bg-black/5"
                  >
                    <span className="block text-lg font-semibold tracking-tight">{item.label}</span>
                    <span className="block text-sm text-muted">{item.note}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2 border-t border-line px-1 pt-3">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="me noopener" className="rounded-lg px-2 py-1.5 text-sm text-muted hover:text-ink">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="glass flex items-center gap-1 rounded-2xl p-1.5">
          <a href={site.resume} className="hidden rounded-lg px-3 py-1.5 text-[13px] text-ink/80 transition-colors hover:bg-black/5 hover:text-ink sm:block">
            <Roll label="Résumé" />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="btn-3d rounded-[10px] px-3.5 py-1.5 text-[13px] font-medium"
          >
            <Roll label="Hire me" />
          </a>
        </div>
      </nav>
    </header>
  );
}
