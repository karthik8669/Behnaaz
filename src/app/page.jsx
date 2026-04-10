"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import { db } from "../../lib/firebase";

const FIREBASE_TIMEOUT_MS = 12000;

function withTimeout(promise, timeoutMs = FIREBASE_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firebase connection timed out."));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

const HOMEPAGE_FIXED_CATEGORIES = [
  {
    name: "Easy Wear Sets",
    queryCategory: "Easy Wear Sets",
    description: "Effortless everyday style",
    gradient: "from-[#FDEEE8] via-[#F8E4DC] to-[#F5D5CC]",
    emoji: "👗",
  },
  {
    name: "Chic Co-ord Sets",
    queryCategory: "Chic Co-ord Sets",
    description: "Coordinated perfection",
    gradient: "from-[#EEE8FD] via-[#E2D8FA] to-[#D5CCF5]",
    emoji: "✨",
  },
  {
    name: "Festive Wedding Wear",
    queryCategory: "Festive / Wedding Wear",
    description: "Celebration ready looks",
    gradient: "from-[#FDF8E8] via-[#F8F0D8] to-[#F5EAC5]",
    emoji: "🌸",
  },
  {
    name: "Office Wear",
    queryCategory: "Office Wear",
    description: "Professional and elegant",
    gradient: "from-[#E8F5FD] via-[#DCEEF9] to-[#CCE5F5]",
    emoji: "💼",
  },
  {
    name: "Casual Daily Wear",
    queryCategory: "Casual Daily Wear",
    description: "Easy breezy everyday looks",
    gradient: "from-[#F0FDE8] via-[#E8F8D9] to-[#E0F5CC]",
    emoji: "☀️",
  },
  {
    name: "Sale Discounts",
    queryCategory: "Sale / Discounts",
    description: "Best deals on top styles",
    gradient: "from-[#FDE8E8] via-[#F8DADA] to-[#F5CCCC]",
    emoji: "🏷️",
  },
  {
    name: "Best Sellers",
    queryCategory: "Best Sellers",
    description: "Customer favourites",
    gradient: "from-[#E8F0FD] via-[#DAE4FA] to-[#CCD5F5]",
    emoji: "⭐",
  },
];

const HOMEPAGE_CATEGORY_LOOKUP = {
  "easy wear sets": "Easy Wear Sets",
  "chic co ord sets": "Chic Co-ord Sets",
  "chic co ord and sets": "Chic Co-ord Sets",
  "festive wedding wear": "Festive Wedding Wear",
  "office wear": "Office Wear",
  "casual daily wear": "Casual Daily Wear",
  "sale discounts": "Sale Discounts",
  "best sellers": "Best Sellers",
  "best seller": "Best Sellers",
};

const HOMEPAGE_MARQUEE_ITEMS = [
  ...HOMEPAGE_FIXED_CATEGORIES.map((item) => item.name),
  ...HOMEPAGE_FIXED_CATEGORIES.map((item) => item.name),
];

const HERO_CARD_LAYOUTS = [
  {
    rotationClass: "-rotate-[5deg]",
    placementClass: "left-2 top-10 z-20 sm:left-6",
    delay: "0ms",
  },
  {
    rotationClass: "rotate-0",
    placementClass: "right-6 top-24 z-30 sm:right-10",
    delay: "140ms",
  },
  {
    rotationClass: "rotate-[5deg]",
    placementClass: "left-12 top-44 z-10 sm:left-20",
    delay: "260ms",
  },
];

const HERO_CARD_GRADIENTS = [
  "from-[#f9ece8] to-[#f0d6cf]",
  "from-[#f9f2e2] to-[#efd9b0]",
  "from-[#f4e3e8] to-[#ecced6]",
];

function normalizeCategoryName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveHomepageCategory(value) {
  const normalized = normalizeCategoryName(value);
  return HOMEPAGE_CATEGORY_LOOKUP[normalized] || null;
}

function mapProduct(doc) {
  const data = doc.data();
  const rawName = data.name || data.product_name || data.title;
  const rawCategory = data.category || data.collection;

  return {
    id: doc.id,
    name: typeof rawName === "string" ? rawName.trim() : "",
    price: data.price ?? data.mrp,
    category:
      typeof rawCategory === "string" && rawCategory.trim()
        ? rawCategory.trim()
        : "Uncategorized",
    description:
      typeof data.short_description === "string"
        ? data.short_description
        : typeof data.description === "string"
          ? data.description
          : "",
    image_url:
      data.image_url || data.imageUrl || data.photo_url || data.photoUrl || "",
    inStock: data.in_stock === undefined ? true : Boolean(data.in_stock),
    hidden: Boolean(data.hidden),
  };
}

function formatPrice(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoadingProducts(true);
      setProductsError("");

      try {
        const productQuery = query(
          collection(db, "products"),
          where("in_stock", "==", true),
        );

        const snap = await withTimeout(getDocs(productQuery));

        if (cancelled) {
          return;
        }

        const mapped = snap.docs
          .map(mapProduct)
          .filter((item) => item.name && item.inStock && !item.hidden);

        setProducts(mapped);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Firebase error:", error);
        setProducts([]);
        setProductsError("Unable to load products. Check connection.");
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((item) => item.category)));
  }, [products]);

  const filters = useMemo(() => ["All", ...categories], [categories]);

  useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter("All");
    }
  }, [activeFilter, filters]);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") {
      return products;
    }

    return products.filter((item) => item.category === activeFilter);
  }, [activeFilter, products]);

  const marqueeItems = HOMEPAGE_MARQUEE_ITEMS;

  const categoryCounts = useMemo(() => {
    const counts = HOMEPAGE_FIXED_CATEGORIES.reduce((accumulator, item) => {
      accumulator[item.name] = 0;
      return accumulator;
    }, {});

    products.forEach((item) => {
      const fixedName = resolveHomepageCategory(item.category);

      if (fixedName) {
        counts[fixedName] += 1;
      }
    });

    return counts;
  }, [products]);

  const categoryCards = useMemo(() => {
    return HOMEPAGE_FIXED_CATEGORIES.map((item) => ({
      ...item,
      count: categoryCounts[item.name] || 0,
    }));
  }, [categoryCounts]);

  const heroProducts = useMemo(() => products.slice(0, 3), [products]);

  return (
    <div id="home" className="motion-pop text-[#1c1410]">
      <section className="relative overflow-hidden">
        <div className="hero-soft-pattern pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-12 lg:pt-16">
          <div>
            <p className="hero-store-tag">BEHNAAZ STORE</p>
            <h1 className="motion-enter motion-delay-1 mt-5 text-[42px] font-bold leading-tight text-[#1c1410] [font-family:var(--font-cormorant)] sm:text-6xl lg:text-[72px]">
              Elegance in Every{" "}
              <span className="italic text-[#c8847a]">Thread</span>
            </h1>
            <p className="motion-enter motion-delay-2 mt-6 max-w-xl text-base leading-relaxed text-[#4c3f38] sm:text-lg">
              Discover refined kurti styles crafted for daily grace, festive
              sparkle, and wedding moments that deserve unforgettable elegance.
            </p>

            <div className="motion-enter motion-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/#products"
                className="motion-button inline-flex w-full justify-center rounded-full bg-[#c8847a] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#b9766d] sm:w-auto"
              >
                Shop Collection
              </Link>
              <Link
                href="/#categories"
                className="motion-button inline-flex w-full justify-center rounded-full border border-[#1c1410] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#1c1410] transition hover:bg-[#1c1410] hover:text-white sm:w-auto"
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
            <span className="absolute bottom-16 right-16 text-base text-[#b8965a]/80">
              ✦
            </span>

            <div className="motion-float absolute right-2 top-2 z-50 hidden rounded-md border border-[#ecd8d2] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5f4a42] shadow-sm sm:right-6 sm:top-6 sm:block sm:text-xs">
              <span className="mr-1 text-[#C8847A]">⭐</span>
              500+ Happy Customers
            </div>

            <div
              className="motion-float absolute right-1 top-1/2 z-50 hidden rounded-md border border-[#ecd8d2] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5f4a42] shadow-sm sm:right-6 sm:block sm:text-xs"
              style={{ animationDelay: "1.4s" }}
            >
              <span className="mr-1 text-[#C8847A]">✦</span>
              New Collection 2026
            </div>

            {heroProducts.map((product, index) => {
              const layout = HERO_CARD_LAYOUTS[index];
              const gradient =
                HERO_CARD_GRADIENTS[index % HERO_CARD_GRADIENTS.length];

              return (
                <div
                  key={product.id}
                  className={`absolute ${layout.placementClass} ${layout.rotationClass} w-[74%] max-w-[280px]`}
                >
                  <article
                    className="hero-card-reveal rounded-2xl border border-[#ead9d3] bg-white/90 p-3 shadow-xl shadow-[#c8847a]/10 backdrop-blur-sm"
                    style={{ animationDelay: layout.delay }}
                  >
                    <div
                      className={`mb-3 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} px-4 text-center`}
                    >
                      <span className="line-clamp-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#4f433d]">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b4456]">
                      In Stock
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-xl text-[#1c1410] [font-family:var(--font-cormorant)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#b8965a]">
                      {formatPrice(product.price)}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <div className="grid grid-cols-3 rounded-2xl border border-[#e8dad4] bg-white/85 text-center shadow-sm backdrop-blur">
            <div className="motion-enter motion-delay-2 px-3 py-4 sm:py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1c1410] sm:text-base">
                200+ Products
              </p>
            </div>
            <div className="motion-enter motion-delay-3 border-x border-[#ece0da] px-3 py-4 sm:py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1c1410] sm:text-base">
                500+ Customers
              </p>
            </div>
            <div className="motion-enter motion-delay-4 px-3 py-4 sm:py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1c1410] sm:text-base">
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
              key={`${item}-${index}`}
              className="flex items-center gap-4 px-4 text-sm font-medium uppercase tracking-[0.1em]"
            >
              <span>{item}</span>
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
            <p className="motion-enter text-xs font-medium uppercase tracking-[0.2em] text-[#b8965a]">
              Featured Categories
            </p>
            <h2 className="motion-enter motion-delay-1 mt-2 text-4xl text-[#1c1410] [font-family:var(--font-cormorant)] sm:text-5xl">
              Shop Categories
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((item, index) => (
            <article
              key={item.name}
              className={`motion-card motion-sheen rounded-2xl border border-[#ebddd8] bg-gradient-to-br ${item.gradient} p-5 transition hover:-translate-y-1 hover:shadow-md`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-3xl">
                <span aria-hidden="true">{item.emoji}</span>
              </div>
              <h3 className="text-2xl text-[#1c1410] [font-family:var(--font-cormorant)]">
                {item.name}
              </h3>
              <p className="mt-2 inline-flex rounded-full border border-[#d8c4ba] bg-white/75 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6a5148]">
                {item.count} Products
              </p>
              <p className="mt-2 text-sm text-[#4f433d]">{item.description}</p>
              <Link
                href={`/products?category=${encodeURIComponent(item.queryCategory)}`}
                className="motion-button mt-5 inline-flex text-sm font-semibold text-[#c8847a] transition hover:text-[#b9766d]"
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
              <p className="motion-enter text-xs font-medium uppercase tracking-[0.2em] text-[#b8965a]">
                Signature Picks
              </p>
              <h2 className="motion-enter motion-delay-1 mt-2 text-4xl text-[#1c1410] [font-family:var(--font-cormorant)] sm:text-5xl">
                Our Products
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`motion-chip rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition sm:text-sm ${
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

          {productsError && (
            <p className="mt-6 rounded-xl border border-[#f0c9c9] bg-[#fff1f1] px-4 py-3 text-sm text-[#8b3e4f]">
              {productsError}
            </p>
          )}

          {loadingProducts ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <article
                  key={index}
                  className="motion-pop overflow-hidden rounded-2xl border border-[#ecd9cf] bg-white/70 shadow-sm"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="aspect-[4/5] animate-pulse bg-[#f2e5dc]" />
                  <div className="space-y-3 p-4 sm:p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-[#f2e5dc]" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#f2e5dc]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#f2e5dc]" />
                  </div>
                </article>
              ))}
            </div>
          ) : visibleProducts.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="motion-enter mt-8 rounded-2xl border border-dashed border-[#dbcfc9] bg-[#faf7f4] p-8 text-center">
              <p className="text-xl text-[#1c1410] [font-family:var(--font-cormorant)]">
                No products found for {activeFilter}.
              </p>
              <p className="mt-2 text-sm text-[#5d504a]">
                Add products in Firestore and they will appear here instantly.
              </p>
            </div>
          )}
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
            className="motion-float h-24 w-24 rounded-full border-2 border-[#b8965a] object-cover sm:h-28 sm:w-28"
          />
          <p className="motion-enter text-2xl italic leading-relaxed text-[#f6e5d7] [font-family:var(--font-cormorant)] sm:text-3xl">
            &ldquo;Every Behnaaz piece is chosen with love so every woman feels
            confident, graceful, and beautifully herself.&rdquo;
          </p>
          <p className="motion-enter motion-delay-2 text-sm uppercase tracking-[0.2em] text-[#b8965a]">
            Tamanna & Namrata, Founders
          </p>
        </div>
      </section>
    </div>
  );
}
