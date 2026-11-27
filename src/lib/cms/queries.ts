// GROQ projections that return exactly the shapes in lib/content/types.ts, so pages don't
// know whether content came from Sanity or the seed files. coalesce() keeps optional lists
// as [] and optional strings as "" to match the seed data.

const s = (field: string) => `"${field}": coalesce(${field}, "")`;
const list = (field: string) => `"${field}": coalesce(${field}, [])`;
const pairs = (field: string, a = "title", b = "body") => `"${field}": coalesce(${field}[]{ ${a}, ${b} }, [])`;
const bySlug = `slug.current == $slug`;

export const settingsQuery = `*[_id == "siteSettings"][0]{
  name, wordmark, url, tagline, description, email, ${s("whatsapp")}, ${s("bookingUrl")},
  location, locality, country, timeZone, ${s("status")}, responseTime,
  "socials": coalesce(socials[]{ label, href }, []),
  "legal": { "entityName": coalesce(legal.entityName, ""), "cin": coalesce(legal.cin, ""), "gstin": coalesce(legal.gstin, "") }
}`;

export const homeQuery = `*[_id == "homePage"][0]{
  "hero": { "title": hero.title, "sub": hero.sub },
  ${list("marquee")}, ${pairs("process")}, ${pairs("principles")}, ${pairs("audiences")}
}`;

const service = `{
  "slug": slug.current, tile, name, summary, headline, intro,
  ${pairs("outcomes")}, ${list("deliverables")}, ${list("idealFor")}, ${pairs("faqs", "q", "a")},
  "packages": coalesce(packages[]->slug.current, [])
}`;
export const servicesQuery = `*[_type == "service"] | order(order asc) ${service}`;
export const serviceQuery = `*[_type == "service" && ${bySlug}][0] ${service}`;

export const packagesQuery = `*[_type == "engagementPackage"] | order(order asc) {
  "slug": slug.current, name, duration, summary, ${list("includes")}
}`;

const step = `{ title, body, scene }`;
const product = `{
  "slug": slug.current, name, shortName, tile, tagline, summary, status,
  ${list("audience")}, ${pairs("features")}, ${list("rules")},
  "steps": coalesce(steps[]${step}, []),
  "modules": coalesce(modules[]{ id, name, summary, "steps": coalesce(steps[]${step}, []) }, []),
  "window": window{ path, ${list("sidebar")}, activeItem, title, action, columns, "rows": coalesce(rows[]{ id, item, qty, state, tone }, []) }
}`;
export const productsQuery = `*[_type == "product"] | order(order asc) ${product}`;
export const productQuery = `*[_type == "product" && ${bySlug}][0] ${product}`;

export const workQuery = `*[_type == "workItem"] | order(order asc) {
  "slug": slug.current, kind, tab, title, where, body, ${list("points")}, ${list("tags")}, tiles, href,
  "caseStudy": select(defined(caseStudy.challenge) => caseStudy{
    ${s("client")}, ${s("role")}, challenge, ${pairs("approach")}, ${pairs("decisions")},
    ${list("outcome")}, "product": product->slug.current
  })
}`;

export const testimonialsQuery = `*[_type == "testimonial" && published == true] | order(order asc) {
  quote, name, role, company, published
}`;
