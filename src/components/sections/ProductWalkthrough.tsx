import Link from "next/link";
import type { Product } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ProductScreen } from "./ProductScreen";
import { StepScroller } from "./StepScroller";

// Introduces a product on the home page: its app window stands up in 3D, then its journey
// plays step by step beside a live scene.
export function ProductWalkthrough({ product }: { product: Product }) {
  return (
    <section id={`${product.slug}-walkthrough`} aria-labelledby={`${product.slug}-title`} className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Our products</p>
          <BlurReveal id={`${product.slug}-title`} className="mt-4 text-hero font-medium">
            {`${product.shortName}, by Brightseid.`}
          </BlurReveal>
          <p className="mx-auto mt-6 max-w-[54ch] text-ink/65">{product.summary}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={`#${product.slug}-steps`} className="btn-3d inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
              Walk through it
            </a>
            <Link href={`/products/${product.slug}`} className="btn-light inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
              See every module
            </Link>
          </div>
        </div>

        <ProductScreen product={product} className="mt-16" />

        <div id={`${product.slug}-steps`} className="mt-28 scroll-mt-24">
          <StepScroller steps={product.steps} rules={product.rules} />
        </div>
      </div>
    </section>
  );
}
