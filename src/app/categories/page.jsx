"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";

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

const CATEGORIES = [
  {
    name: "Easy Wear Sets",
    description: "Effortless everyday style",
    gradient: "linear-gradient(135deg,#FDEEE8,#F5D5CC)",
    emoji: "👗",
  },
  {
    name: "Chic Co-ord Sets",
    description: "Coordinated perfection",
    gradient: "linear-gradient(135deg,#EEE8FD,#D5CCF5)",
    emoji: "✨",
  },
  {
    name: "Festive / Wedding Wear",
    description: "Celebration ready looks",
    gradient: "linear-gradient(135deg,#FDF8E8,#F5EAC5)",
    emoji: "🌸",
  },
  {
    name: "Casual Wear",
    description: "Easy breezy everyday looks",
    gradient: "linear-gradient(135deg,#F0FDE8,#E0F5CC)",
    emoji: "☀️",
  },
  {
    name: "Short Kurties",
    description: "Fun and trendy short styles",
    gradient: "linear-gradient(135deg,#FDE8F5,#F5CCE8)",
    emoji: "👘",
  },
  {
    name: "Sale / Discounts",
    description: "Best deals on top styles",
    gradient: "linear-gradient(135deg,#FDE8E8,#F5CCCC)",
    emoji: "🏷️",
  },
  {
    name: "Best Sellers",
    description: "Customer favourites",
    gradient: "linear-gradient(135deg,#E8F0FD,#CCD5F5)",
    emoji: "⭐",
  },
];

const INITIAL_COUNTS = CATEGORIES.reduce((accumulator, item) => {
  accumulator[item.name] = 0;
  return accumulator;
}, {});

const FIXED_CATEGORY_LOOKUP = CATEGORIES.reduce((accumulator, item) => {
  accumulator[normalizeCategoryName(item.name)] = item.name;
  return accumulator;
}, {});

function normalizeCategoryName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCategoryValues(value) {
  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

export default function CategoriesPage() {
  const [productCounts, setProductCounts] = useState(INITIAL_COUNTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCategoryCounts() {
      setLoading(true);
      setError("");

      try {
        const productQuery = query(
          collection(db, "products"),
          where("in_stock", "==", true),
        );

        const snap = await withTimeout(getDocs(productQuery));

        if (cancelled) {
          return;
        }

        const countMap = { ...INITIAL_COUNTS };

        snap.docs.forEach((doc) => {
          const data = doc.data();
          const matchedCategories = new Set();

          if (Boolean(data.hidden)) {
            return;
          }

          const categoryValues = [
            ...extractCategoryValues(data.category),
            ...extractCategoryValues(data.collection),
          ];

          categoryValues.forEach((rawCategory) => {
            const fixedCategoryName =
              FIXED_CATEGORY_LOOKUP[normalizeCategoryName(rawCategory)];

            if (fixedCategoryName) {
              matchedCategories.add(fixedCategoryName);
            }
          });

          matchedCategories.forEach((name) => {
            countMap[name] += 1;
          });
        });

        setProductCounts(countMap);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Firebase error:", error);
        setProductCounts(INITIAL_COUNTS);
        setError("Unable to load products. Check connection.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCategoryCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="motion-pop min-h-screen bg-[#FAF7F4] px-4 py-12 text-[#1C1410] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="motion-enter text-xs font-semibold uppercase tracking-[0.2em] text-[#B8965A]">
          Behnaaz Collections
        </p>
        <h1 className="motion-enter motion-delay-1 mt-3 text-4xl text-[#1C1410] [font-family:var(--font-cormorant)] sm:text-5xl">
          Shop by Category
        </h1>
        <p className="motion-enter motion-delay-2 mt-3 max-w-2xl text-sm leading-relaxed text-[#6E5A64] sm:text-base">
          Discover our curated signature collections designed for every mood,
          moment, and celebration.
        </p>

        {error && (
          <p className="mt-8 rounded-lg border border-[#f0c9c9] bg-[#fff1f1] px-4 py-3 text-sm text-[#8b3e4f]">
            {error}
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {CATEGORIES.map((item, index) => {
            const count = productCounts[item.name] || 0;
            const hasProducts = count > 0;

            return (
              <article
                key={item.name}
                className="motion-card motion-sheen group min-w-0 rounded-3xl border border-[#E6D5CE] p-4 shadow-[0_10px_24px_rgba(112,64,56,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D9A29A] hover:shadow-[0_14px_30px_rgba(133,74,67,0.18)] sm:p-5"
                style={{
                  backgroundImage: item.gradient,
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <p
                  className="text-center"
                  style={{ fontSize: "48px", lineHeight: "1" }}
                  aria-hidden="true"
                >
                  {item.emoji}
                </p>

                <h2 className="mt-3 break-words text-center text-lg leading-tight text-[#2D1D18] [font-family:var(--font-cormorant)] sm:text-[1.75rem]">
                  {item.name}
                </h2>

                <p className="mt-2 text-center text-xs leading-relaxed text-[#6E5A64] sm:text-sm">
                  {item.description}
                </p>

                <p className="mx-auto mt-4 inline-flex rounded-full border border-[#DFC8C2] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6A5148]">
                  {loading
                    ? "Loading..."
                    : hasProducts
                      ? `${count} Products`
                      : "Coming Soon"}
                </p>

                <div className="mt-5 text-center">
                  <Link
                    href={`/products?category=${encodeURIComponent(item.name)}`}
                    className="motion-button inline-flex items-center rounded-full bg-[#C8847A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#B9766D]"
                  >
                    View Collection →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
