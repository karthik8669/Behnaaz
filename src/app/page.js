"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PHONE_DIAL = "+918619279790";

const CATEGORIES = [
  {
    name: "Easy Wear Sets",
    emoji: "🌸",
    gradient: "from-[#f5eae8] to-[#f3d8d3]",
    description: "Everyday comfort with effortless grace.",
  },
  {
    name: "Co-ord Sets",
    emoji: "✨",
    gradient: "from-[#f9f1e4] to-[#f1dec0]",
    description: "Perfectly paired looks for modern elegance.",
  },
  {
    name: "Festive Wear",
    emoji: "🎊",
    gradient: "from-[#f2dde2] to-[#efd0d8]",
    description: "Celebrate every event in statement silhouettes.",
  },
  {
    name: "Wedding Collection",
    emoji: "💫",
    gradient: "from-[#efe8d8] to-[#e8d4ad]",
    description: "Grand designs for cherished wedding moments.",
  },
  {
    name: "Office Wear",
    emoji: "👜",
    gradient: "from-[#efe7e2] to-[#e6d8cf]",
    description: "Polished kurtis crafted for your workday rhythm.",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Noor Rose Kurti Set",
    category: "Easy Wear Sets",
    price: 1799,
    subtitle: "Soft cotton blend with floral neckline",
    emoji: "🌷",
    tone: "from-[#f5eae8] to-[#efd4cf]",
  },
  {
    id: 2,
    name: "Zoya Co-ord Charm",
    category: "Co-ord Sets",
    price: 2299,
    subtitle: "Smart silhouette with delicate detailing",
    emoji: "✨",
    tone: "from-[#f7efd9] to-[#ecd7ae]",
  },
  {
    id: 3,
    name: "Mehr Festive Aura",
    category: "Festive Wear",
    price: 2699,
    subtitle: "Rich textures designed for celebration nights",
    emoji: "🎉",
    tone: "from-[#f3e2e7] to-[#eec9d2]",
  },
  {
    id: 4,
    name: "Sitara Wedding Edit",
    category: "Wedding Collection",
    price: 3499,
    subtitle: "Premium drape and hand-finished highlights",
    emoji: "👑",
    tone: "from-[#efe6d6] to-[#e2cda4]",
  },
];

const FILTERS = ["All", ...CATEGORIES.map((item) => item.name)];

const HERO_FLOATING_CARDS = [
  {
    id: "new",
    tag: "New Arrival",
    name: "Rose Mist Kurti",
    price: "₹ 2,299",
    emoji: "🌷",
    gradient: "from-[#f9ece8] to-[#f0d6cf]",
    rotationClass: "-rotate-[5deg]",
    placementClass: "left-2 top-10 z-20 sm:left-6",
    delay: "0ms",
  },
  {
    id: "best",
    tag: "Best Seller",
    name: "Noor Premium Set",
    price: "₹ 2,899",
    emoji: "✨",
    gradient: "from-[#f9f2e2] to-[#efd9b0]",
    rotationClass: "rotate-0",
    placementClass: "right-6 top-24 z-30 sm:right-10",
    delay: "140ms",
  },
  {
    id: "trend",
    tag: "Trending",
    name: "Sitara Festive",
    price: "₹ 3,499",
    emoji: "💫",
    gradient: "from-[#f4e3e8] to-[#ecced6]",
    rotationClass: "rotate-[5deg]",
    placementClass: "left-12 top-44 z-10 sm:left-20",
    delay: "260ms",
  },
];

const WHATSAPP_MESSAGE = (productName) =>
  `https://wa.me/918619279790?text=${encodeURIComponent(
    `Hi Behnaaz, I want to order ${productName}. Please share details.`,
  )}`;

function ProductCard({ product }) {
  return (
    <article className="group rounded-2xl border border-[#eee2dc] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-44 items-center justify-center rounded-xl bg-gradient-to-br ${product.tone} text-5xl`}
      >
        <span aria-hidden="true">{product.emoji}</span>
      </div>

      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#b8965a]">
          {product.category}
        </p>
        <h3 className="mt-1 text-2xl text-[#1c1410] [font-family:var(--font-cormorant)]">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-[#5a4b44]">{product.subtitle}</p>
        <p className="mt-3 text-lg font-semibold text-[#1c1410]">
          ₹ {product.price.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={WHATSAPP_MESSAGE(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#c8847a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b9766d]"
        >
          WhatsApp
        </a>
        <a
          href={`tel:${PHONE_DIAL}`}
          className="inline-flex items-center justify-center rounded-full border border-[#1c1410] px-4 py-2 text-sm font-semibold text-[#1c1410] transition hover:bg-[#1c1410] hover:text-white"
        >
          Call
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") {
      return PRODUCTS;
    }
    return PRODUCTS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const marqueeItems = [...CATEGORIES, ...CATEGORIES];

  return (
    <div id="home" className="text-[#1c1410]">
      <section className="relative overflow-hidden">
        <div className="hero-soft-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-2 lg:pb-12 lg:pt-16 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8965a]">
              Behnaaz Signature Collection
            </p>
            <h1 className="mt-5 text-5xl leading-tight text-[#1c1410] sm:text-6xl lg:text-7xl [font-family:var(--font-cormorant)]">
              Elegance in Every{" "}
              <span className="italic text-[#c8847a]">Thread</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#4c3f38] sm:text-lg">
              Discover refined kurti styles crafted for daily grace, festive
              sparkle, and wedding moments that deserve unforgettable elegance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#products"
                className="rounded-full bg-[#c8847a] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#b9766d]"
              >
                Shop Collection
              </Link>
              <Link
                href="/#categories"
                className="rounded-full border border-[#1c1410] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#1c1410] transition hover:bg-[#1c1410] hover:text-white"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[390px] w-full max-w-md sm:h-[430px] lg:h-[470px] lg:max-w-[540px]">
            <div className="absolute right-2 top-4 h-72 w-72 rounded-full border border-[#e8d0cb] bg-[#f7eeec]" />
            <div className="absolute right-16 top-24 h-44 w-44 rounded-full border border-[#dcc7b5]/80" />

            <span className="absolute left-1 top-6 text-lg text-[#b8965a]/80">
              ✦
            </span>
            <span className="absolute right-5 top-14 text-sm text-[#b8965a]/80">
              ✦
            </span>
            <span className="absolute right-16 bottom-16 text-base text-[#b8965a]/80">
              ✦
            </span>

            <div className="absolute left-0 top-0 z-40 rounded-full border border-[#e9d8d1] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#7b4456] shadow-sm">
              100+ Happy Customers
            </div>

            <div className="absolute bottom-4 right-2 z-40 rounded-full border border-[#e3d3c5] bg-[#fff7ea] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#8f6a3a] shadow-sm">
              Free Delivery
            </div>

            {HERO_FLOATING_CARDS.map((card) => (
              <div
                key={card.id}
                className={`absolute ${card.placementClass} ${card.rotationClass} w-[74%] max-w-[280px]`}
              >
                <article
                  className="hero-card-reveal rounded-2xl border border-[#ead9d3] bg-white/90 p-3 shadow-xl shadow-[#c8847a]/10 backdrop-blur-sm"
                  style={{ animationDelay: card.delay }}
                >
                  <div
                    className={`mb-3 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-4xl`}
                  >
                    <span aria-hidden="true">{card.emoji}</span>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b4456]">
                    {card.tag}
                  </p>
                  <h3 className="mt-1 text-xl text-[#1c1410] [font-family:var(--font-cormorant)]">
                    {card.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#b8965a]">
                    {card.price}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <div className="grid grid-cols-3 rounded-2xl border border-[#e8dad4] bg-white/85 text-center shadow-sm backdrop-blur">
            <div className="px-3 py-4 sm:py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1c1410] sm:text-base">
                100+ Products
              </p>
            </div>
            <div className="border-x border-[#ece0da] px-3 py-4 sm:py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1c1410] sm:text-base">
                500+ Customers
              </p>
            </div>
            <div className="px-3 py-4 sm:py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1c1410] sm:text-base">
                5★ Rated
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="marquee-wrap overflow-hidden bg-[#1c1410] py-3 text-[#f8efe9]">
        <div className="marquee-track">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-4 px-4 text-sm font-medium uppercase tracking-[0.1em]"
            >
              <span>{item.name}</span>
              <span className="text-[#b8965a]">★</span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="categories"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8965a]">
              Shop By Mood
            </p>
            <h2 className="mt-2 text-4xl text-[#1c1410] sm:text-5xl [font-family:var(--font-cormorant)]">
              Curated Categories
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((item) => (
            <article
              key={item.name}
              className={`rounded-2xl border border-[#ebddd8] bg-gradient-to-br ${item.gradient} p-5 transition hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-3xl">
                <span aria-hidden="true">{item.emoji}</span>
              </div>
              <h3 className="text-2xl text-[#1c1410] [font-family:var(--font-cormorant)]">
                {item.name}
              </h3>
              <p className="mt-2 text-sm text-[#4f433d]">{item.description}</p>
              <Link
                href={`/#products`}
                className="mt-5 inline-flex text-sm font-semibold text-[#c8847a] transition hover:text-[#b9766d]"
              >
                View Collection →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="products" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8965a]">
                Featured Picks
              </p>
              <h2 className="mt-2 text-4xl text-[#1c1410] sm:text-5xl [font-family:var(--font-cormorant)]">
                Our Products
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition sm:text-sm ${
                    activeFilter === filter
                      ? "border-[#c8847a] bg-[#c8847a] text-white"
                      : "border-[#ddd0ca] bg-[#faf7f4] text-[#1c1410] hover:border-[#c8847a] hover:text-[#c8847a]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-4 rounded-2xl border border-dashed border-[#dbcfc9] bg-[#faf7f4] p-8 text-center">
                <p className="text-xl text-[#1c1410] [font-family:var(--font-cormorant)]">
                  New arrivals for {activeFilter} are coming soon.
                </p>
                <p className="mt-2 text-sm text-[#5d504a]">
                  Tap WhatsApp and we will share available pieces instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="owner-quote"
        className="bg-[#1c1410] px-4 py-14 text-[#f7ece4] sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <Image
            src="/owner.jpg"
            alt="Behnaaz owner"
            width={110}
            height={110}
            className="h-24 w-24 rounded-full border-2 border-[#b8965a] object-cover sm:h-28 sm:w-28"
          />
          <p className="text-2xl italic leading-relaxed text-[#f6e5d7] [font-family:var(--font-cormorant)] sm:text-3xl">
            “Every Behnaaz piece is chosen with love so every woman feels
            confident, graceful, and beautifully herself.”
          </p>
          <p className="text-sm uppercase tracking-[0.2em] text-[#b8965a]">
            Tamanna & Namrata, Founders
          </p>
        </div>
      </section>
    </div>
  );
}
