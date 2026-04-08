"use client";

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

export default function ProductCard({ product }) {
  const { name, price, category, description, imageUrl, inStock } = product;

  const whatsappMessage = `Hi, I am interested in ${name}`;
  const whatsappUrl = `https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#ecd9cf] bg-[#fffdfb] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#ecd9cf]/50">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7ebe3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || "/logo.png"}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <span className="absolute left-3 top-3 rounded-full border border-[#d7bd95] bg-[#fff2de] px-3 py-1 text-xs font-semibold text-[#8f6a3a]">
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
          {description ||
            "Beautifully crafted kurti designed for comfort and elegance."}
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebc59]"
          >
            WhatsApp to Order
          </a>

          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-[#d7bd95] bg-[#fff5e9] px-4 py-2.5 text-sm font-semibold text-[#8f6a3a] transition hover:bg-[#fdeed9]"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </article>
  );
}
