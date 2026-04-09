"use client";

import { useEffect, useState } from "react";

const ORDER_PHONE = "918619279790";
const INSTAGRAM_LINK = "https://www.instagram.com/the_behnaaz_store";

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

export default function ProductCard({ product, index = 0 }) {
  const { name, price, category, description, inStock } = product;
  const imageSource =
    product.image_url ||
    product.imageUrl ||
    product.photo_url ||
    product.photoUrl ||
    "";
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setShowFallback(false);
  }, [imageSource]);

  const whatsappMessage = `Hi, I am interested in ${name}`;
  const whatsappUrl = `https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <article
      className="motion-card motion-sheen group rounded-2xl border border-[#ecd9cf] bg-[#fffdfb] shadow-sm hover:shadow-md hover:shadow-[#ecd9cf]/50"
      style={{ animationDelay: `${Math.min(index, 10) * 85}ms` }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7ebe3]">
        {imageSource && !showFallback ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSource}
              alt={name || "Product image"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              className="transition duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setShowFallback(true)}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg,#F5EAE8,#E8C4BE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            👗
          </div>
        )}

        <span className="absolute left-[10px] top-[10px] rounded-[2px] bg-[#C8847A] px-[8px] py-[4px] text-[10px] font-bold tracking-[0.06em] text-white">
          10% OFF
        </span>

        <span className="absolute bottom-3 left-3 rounded-full border border-[#d7bd95] bg-[#fff2de] px-3 py-1 text-xs font-semibold text-[#8f6a3a]">
          {category}
        </span>

        {!inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-[#8f3d56] px-3 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-[#6f3f50]">{name}</h3>

        <p className="text-base font-bold text-[#8f6a3a]">
          {formatPrice(price)}
        </p>

        <p className="min-h-12 text-sm leading-relaxed text-[#6e5a64]">
          {description}
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-button inline-flex items-center justify-center rounded-lg bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebc59]"
          >
            WhatsApp to Order
          </a>

          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-button inline-flex items-center justify-center rounded-lg border border-[#d7bd95] bg-[#fff5e9] px-4 py-2.5 text-sm font-semibold text-[#8f6a3a] transition hover:bg-[#fdeed9]"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </article>
  );
}
