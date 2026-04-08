import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden border-b border-[#ecd9cf]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,#fff7f2_0%,#fffaf7_45%,#fdf3ea_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#f6d7cf]/45 blur-3xl sm:h-72 sm:w-72"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#e9d2a8]/35 blur-3xl sm:h-80 sm:w-80"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#b08b57]">
            Behnaaz Kurti Studio
          </p>

          <h1 className="text-4xl font-semibold leading-tight text-[#6f3f50] sm:text-5xl lg:text-6xl">
            Elegance in Every Thread
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b5761] sm:text-lg">
            Explore our exclusive kurti collections
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#best-sellers"
              className="inline-flex items-center justify-center rounded-full bg-[#7b4456] px-7 py-3 text-sm font-semibold text-[#fff8f2] shadow-md shadow-[#a36e58]/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#6c384b]"
            >
              Shop Now
            </Link>

            <Link
              href="/#categories"
              className="inline-flex items-center justify-center rounded-full border border-[#d9b47d] bg-[#fff7ee] px-7 py-3 text-sm font-semibold text-[#8a5f2d] transition-colors duration-200 hover:bg-[#fdeedc]"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
