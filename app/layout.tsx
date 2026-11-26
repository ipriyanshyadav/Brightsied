import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSettings } from "@/lib/content";
import Script from "next/script";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MOTION_PAUSED, MOTION_STORAGE_KEY } from "@/lib/motion";
import { SOUND_ON, SOUND_STORAGE_KEY } from "@/lib/sound";
import { SvgDefs } from "@/components/ui/GlossyTile";

const display = localFont({
  src: "../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
});

const code = localFont({
  src: "../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-code",
  weight: "100 800",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSettings();
  const title = `${site.name}: ${site.tagline}`;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: site.url,
      title,
      description: site.description,
      siteName: site.name,
    },
    twitter: { card: "summary_large_image", title, description: site.description },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f4f4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script below may set data-motion / data-sound before React hydrates.
    <html lang="en" className={`${display.variable} ${code.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        {/* Apply stored "pause animations" and "sound on" choices before hydration, so nothing starts moving and then stops. */}
        <Script id="motion-pref" strategy="beforeInteractive">
          {`try{var s=localStorage,d=document.documentElement.dataset;if(s.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})===${JSON.stringify(MOTION_PAUSED)})d.motion=${JSON.stringify(MOTION_PAUSED)};if(s.getItem(${JSON.stringify(SOUND_STORAGE_KEY)})===${JSON.stringify(SOUND_ON)})d.sound=${JSON.stringify(SOUND_ON)}}catch(e){}`}
        </Script>
        <SvgDefs />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ground"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
