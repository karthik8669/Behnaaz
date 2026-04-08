"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ProductCard from "../../../components/ProductCard";
import { db } from "../../../lib/firebase";

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

  return {
    id: doc.id,
    name: data.name || data.product_name || data.title || "Behnaaz Kurti",
    price: data.price ?? data.mrp ?? 0,
    category: data.category || "Kurti",
    description: data.short_description || data.description || "",
    imageUrl:
      data.image_url ||
      data.imageUrl ||
      data.photo_url ||
      data.photoUrl ||
      "/logo.png",
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
    setLoading(true);
    setError("");

    const productQuery = query(
      collection(db, "products"),
      where("in_stock", "==", true),
    );

    const unsubscribe = onSnapshot(
      productQuery,
      (snapshot) => {
        const mapped = snapshot.docs.map(mapProduct);
        setProducts(mapped);
        setLoading(false);
      },
      () => {
        setError(
          "Unable to load products right now. Please try again shortly.",
        );
        setProducts([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
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
    <div className="min-h-screen bg-[#fffaf7] text-[#3a2630]">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b08b57]">
          Behnaaz Collection
        </p>
        <h1 className="text-3xl font-semibold text-[#6f3f50] sm:text-4xl">
          Product Gallery
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6e5a64] sm:text-base">
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
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
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
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-[#ecd9cf] bg-white/70 px-4 py-6 text-sm text-[#6e5a64]">
            No products found for the selected category.
          </p>
        )}
      </section>
    </div>
  );
}
