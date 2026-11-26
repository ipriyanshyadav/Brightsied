import "server-only";
import { audiences, hero, marquee, nav, principles, process, settings } from "@/content/seed/site";
import { packages, services } from "@/content/seed/services";
import { products } from "@/content/seed/products";
import { testimonials, work } from "@/content/seed/work";
import { publicConfig } from "@/lib/config";
import type { SiteSettings } from "./types";

// The only way pages and components read content. Async on purpose: when Sanity replaces
// the seed modules, these become CMS queries and nothing that calls them has to change.

export async function getSettings(): Promise<SiteSettings> {
  return { ...settings, url: publicConfig.siteUrl ?? settings.url };
}

export async function getNav() {
  return nav;
}

export async function getHome() {
  return { hero, marquee, process, principles, audiences };
}

export async function getServices() {
  return services;
}

export async function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getPackages(slugs?: string[]) {
  return slugs ? packages.filter((p) => slugs.includes(p.slug)) : packages;
}

export async function getProducts() {
  return products;
}

export async function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getWork() {
  return work;
}

export async function getTestimonials() {
  return testimonials.filter((t) => t.published);
}
