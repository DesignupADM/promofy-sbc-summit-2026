import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import Reveal from "./reveal";

export default function ProductShowcase() {
  return (
    <section className="products section-pad" id="products" aria-labelledby="products-heading">
      <div className="section-shell">
        <Reveal>
          <div className="products-head">
            <div>
              <p className="eyebrow">The Promofy Suite</p>
              <h2 id="products-heading">
                Five ways to <span className="grad-text">turn engagement on.</span>
              </h2>
            </div>
            <p>
              Every capability runs on the same platform, the same data and the same infrastructure —
              switch them on together, or start where the opportunity is biggest.
            </p>
          </div>
        </Reveal>

        <div className="product-list">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.id} as="article" className="product-row" delay={i % 3 === 0 ? undefined : (i % 3) as 1 | 2}>
              <div className="product-media">
                <span className="media-tag">Promofy {product.name}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="product-copy">
                <p className="product-index">{product.index}</p>
                <p className="product-label">{product.label}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-tags">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a
                  className="product-link"
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Explore ${product.name} on promofy.ai`}
                >
                  Explore {product.name}
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
