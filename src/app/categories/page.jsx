import Link from "next/link";

const CATEGORIES = [
  {
    name: "Easy Wear Sets",
    gradient: "from-[#f5eae8] to-[#f1d7d2]",
  },
  {
    name: "Chic Co-ord and Sets",
    gradient: "from-[#f9f1e4] to-[#ecd8b8]",
  },
  {
    name: "Style in Comfort",
    gradient: "from-[#f2dde2] to-[#eecfd7]",
  },
  {
    name: "Festive Wedding Wear",
    gradient: "from-[#efe8d8] to-[#e3cfac]",
  },
  {
    name: "Best Sellers",
    gradient: "from-[#efe7e2] to-[#e5d7cf]",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] px-4 py-12 text-[#1C1410] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8965A]">
          Behnaaz Collections
        </p>
        <h1 className="mt-3 text-4xl text-[#1C1410] [font-family:var(--font-cormorant)] sm:text-5xl">
          Shop by Category
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6E5A64] sm:text-base">
          Explore all curated categories and discover the perfect Behnaaz styles
          for every moment.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((item) => (
            <article
              key={item.name}
              className={`rounded-2xl border border-[#E9DCD6] bg-gradient-to-br ${item.gradient} p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <h2 className="text-3xl leading-tight text-[#1C1410] [font-family:var(--font-cormorant)]">
                {item.name}
              </h2>

              <Link
                href={`/products?category=${encodeURIComponent(item.name)}`}
                className="mt-6 inline-flex items-center rounded-full bg-[#C8847A] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#B9766D]"
              >
                View Products
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
