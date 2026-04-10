"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "../../../components/ProductCard";
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

function ProductSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#ecd9cf] bg-white/70 shadow-sm">
      <div className="aspect-[4/5] animate-pulse bg-[#f2e5dc]" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#f2e5dc]" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-[#f2e5dc]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f2e5dc]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[#f2e5dc]" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="h-10 animate-pulse rounded bg-[#f2e5dc]" />
          <div className="h-10 animate-pulse rounded bg-[#f2e5dc]" />
        </div>
      </div>
    </article>
  );
}

function mapProduct(doc) {
  const data = doc.data();
  const rawName = data.name || data.product_name || data.title;
  const rawCategory = data.category || data.collection;

  return {
    id: doc.id,
    name: typeof rawName === "string" ? rawName.trim() : "",
    price: data.price ?? data.mrp ?? 0,
    discount: data.discount ?? 0,
    category:
      typeof rawCategory === "string" && rawCategory.trim()
        ? rawCategory.trim()
        : "Uncategorized",
    description: data.short_description || data.description || "",
    image_url:
      data.image_url || data.imageUrl || data.photo_url || data.photoUrl || "",
    inStock: data.in_stock === undefined ? true : Boolean(data.in_stock),
    hidden: Boolean(data.hidden),
  };
}

export default function ProductGalleryPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
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

        const mapped = snap.docs.map(mapProduct);
        setProducts(mapped);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Firebase error:", error);
        setProducts([]);
        setError("Unable to load products. Check connection.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const visibleProducts = products.filter(
      (item) => item.inStock && !item.hidden,
    );
    const unique = Array.from(
      new Set(visibleProducts.map((item) => item.category)),
    );
    return ["All", ...unique];
  }, [products]);

  useEffect(() => {
    if (!categoryFromUrl) {
      return;
    }

    if (
      categories.includes(categoryFromUrl) &&
      selectedCategory !== categoryFromUrl
    ) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    const visibleProducts = products.filter(
      (item) => item.inStock && !item.hidden,
    );

    if (selectedCategory === "All") {
      return visibleProducts;
    }

    return visibleProducts.filter((item) => item.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="motion-pop min-h-screen bg-[#fffaf7] text-[#3a2630]">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        <p className="motion-enter mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b08b57]">
          Behnaaz Collection
        </p>
        <h1 className="motion-enter motion-delay-1 text-3xl font-semibold text-[#6f3f50] sm:text-4xl">
          Product Gallery
        </h1>
        <p className="motion-enter motion-delay-2 mt-3 max-w-2xl text-sm leading-relaxed text-[#6e5a64] sm:text-base">
          Explore our latest in-stock kurti designs, crafted for comfort and
          timeless style.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`motion-chip rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-[#7b4456] bg-[#7b4456] text-white"
                    : "border-[#dec8b3] bg-[#fff6ee] text-[#7b4456] hover:bg-[#fdebdc]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-[#f0c9c9] bg-[#fff1f1] px-4 py-3 text-sm text-[#8b3e4f]">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="motion-pop"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <ProductSkeleton />
              </div>
            ))}
          </div>
        ) : filteredProducts.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="motion-enter mt-8 rounded-xl border border-[#ecd9cf] bg-white/70 px-4 py-6 text-sm text-[#6e5a64]">
            No products found for the selected category.
          </p>
        )}
      </section>
    </div>
  );
}
