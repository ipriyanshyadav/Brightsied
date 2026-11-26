import type { MetadataRoute } from "next";
import { getProducts, getServices, getSettings } from "@/lib/content";

const PAGES = ["", "/services", "/products", "/work", "/about", "/contact", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, services, products] = await Promise.all([getSettings(), getServices(), getProducts()]);
  const paths = [
    ...PAGES,
    ...services.map((s) => `/services/${s.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
