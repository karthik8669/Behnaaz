"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import OrderModal from "../../../../components/OrderModal";
import { db } from "../../../../lib/firebase";

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

function mapProduct(id, data) {
  const numericPrice = Number(data.price ?? data.mrp ?? 0);
  const numericDiscount = Number(data.discount ?? 0);

  return {
    id,
    name: (
      data.name ||
      data.product_name ||
      data.title ||
      "Untitled Product"
    ).trim(),
    category: (data.category || data.collection || "Uncategorized").trim(),
    description: data.short_description || data.description || "",
    image_url:
      data.image_url || data.imageUrl || data.photo_url || data.photoUrl || "",
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    discount:
      Number.isFinite(numericDiscount) &&
      numericDiscount >= 0 &&
      numericDiscount < 100
        ? numericDiscount
        : 0,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    inStock: data.in_stock === undefined ? true : Boolean(data.in_stock),
    hidden: Boolean(data.hidden),
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    setShowFallback(false);
  }, [product?.image_url]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      if (!productId) {
        setLoading(false);
        setError("Invalid product link.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const snap = await withTimeout(getDoc(doc(db, "products", productId)));

        if (cancelled) {
          return;
        }

        if (!snap.exists()) {
          setProduct(null);
          setError("Product not found.");
          return;
        }

        const mapped = mapProduct(snap.id, snap.data());

        if (mapped.hidden || !mapped.inStock) {
          setProduct(null);
          setError("This product is currently unavailable.");
          return;
        }

        setProduct(mapped);
      } catch (fetchError) {
        if (cancelled) {
          return;
        }

        console.error("Firebase error:", fetchError);
        setProduct(null);
        setError("Unable to load product. Check connection.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const pricing = useMemo(() => {
    if (!product) {
      return {
        hasValidPrice: false,
        hasDiscount: false,
        originalPrice: 0,
      };
    }

    const hasValidPrice =
      Number.isFinite(Number(product.price)) && product.price > 0;
    const hasDiscount = hasValidPrice && product.discount > 0;
    const originalPrice = hasDiscount
      ? Math.round(product.price / (1 - product.discount / 100))
      : 0;

    return { hasValidPrice, hasDiscount, originalPrice };
  }, [product]);

  return (
    <div className="motion-pop min-h-screen bg-[#fffaf7] px-4 py-10 text-[#1C1410] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/products"
          className="motion-underline-link text-xs font-semibold uppercase tracking-[0.12em] text-[#8C7670] hover:text-[#C8847A]"
        >
          ← Back to Products
        </Link>

        {loading ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#ecd9cf] bg-white/80 shadow-sm">
            <div className="aspect-[4/5] animate-pulse bg-[#f2e5dc] sm:aspect-[16/9]" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-2/3 animate-pulse rounded bg-[#f2e5dc]" />
              <div className="h-5 w-1/4 animate-pulse rounded bg-[#f2e5dc]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#f2e5dc]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[#f2e5dc]" />
            </div>
          </div>
        ) : error ? (
          <p className="mt-6 rounded-lg border border-[#f0c9c9] bg-[#fff1f1] px-4 py-3 text-sm text-[#8b3e4f]">
            {error}
          </p>
        ) : product ? (
          <section className="mt-6 grid gap-6 rounded-3xl border border-[#ecd9cf] bg-white/85 p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#f7ebe3]">
              {product.image_url && !showFallback ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => setShowFallback(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl">
                  👗
                </div>
              )}

              <span className="absolute bottom-3 left-3 rounded-full border border-[#d7bd95] bg-[#fff2de] px-3 py-1 text-xs font-semibold text-[#8f6a3a]">
                {product.category}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="text-3xl text-[#1C1410] [font-family:var(--font-cormorant)] sm:text-4xl">
                {product.name}
              </h1>

              {pricing.hasValidPrice ? (
                <div className="mt-4 flex items-center gap-2">
                  {pricing.hasDiscount ? (
                    <>
                      <span className="text-sm text-[#8C7670] line-through">
                        ₹{pricing.originalPrice}
                      </span>
                      <span className="text-2xl font-semibold text-[#B8965A]">
                        ₹{Math.round(product.price)}
                      </span>
                      <span className="rounded bg-[#C8847A] px-2 py-1 text-[10px] font-semibold text-white">
                        {product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-[#B8965A]">
                      ₹{Math.round(product.price)}
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-xl font-semibold text-[#8f6a3a]">
                  Price on request
                </p>
              )}

              {product.description ? (
                <p className="mt-4 text-sm leading-relaxed text-[#6E5A64] sm:text-base">
                  {product.description}
                </p>
              ) : null}

              {product.sizes?.length ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8C7670]">
                    Available Sizes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full border border-[#E0D1CA] bg-[#FAF7F4] px-3 py-1 text-xs font-semibold text-[#4B3C36]"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowOrder(true)}
                  style={{
                    background: "#C8847A",
                    color: "#fff",
                    border: "none",
                    padding: "12px 0",
                    fontSize: "12px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "6px",
                    fontFamily: "sans-serif",
                    fontWeight: "600",
                  }}
                >
                  🛍️ Buy Now
                </button>

                <a
                  href="tel:+918619279790"
                  className="motion-button inline-flex items-center justify-center rounded-lg border border-[#d7bd95] bg-[#fff5e9] px-4 py-2.5 text-sm font-semibold text-[#8f6a3a] transition hover:bg-[#fdeed9]"
                >
                  Call
                </a>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {showOrder && product ? (
        <OrderModal product={product} onClose={() => setShowOrder(false)} />
      ) : null}
    </div>
  );
}
