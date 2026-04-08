const WHATSAPP_URL = "https://wa.me/918619279790";
const INSTAGRAM_URL = "https://instagram.com/the_behnaaz_store";
const PHONE_NUMBER = "+91 8619279790";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] px-4 py-12 text-[#1C1410] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl border border-[#E9DCD6] bg-gradient-to-br from-[#F8EEEC] via-[#F6ECE6] to-[#F4E5DE] p-6 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8965A]">
            Behnaaz Contact
          </p>
          <h1 className="mt-3 text-4xl text-[#1C1410] [font-family:var(--font-cormorant)] sm:text-5xl">
            Let&apos;s Connect
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6E5A64] sm:text-base">
            Reach out for product details, styling help, and order support. We
            are available every day for your shopping queries.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                WhatsApp
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-lg font-medium text-[#1C1410] hover:text-[#B9766D]"
              >
                wa.me/918619279790
              </a>
            </div>

            <div className="rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                Instagram
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-lg font-medium text-[#1C1410] hover:text-[#B9766D]"
              >
                instagram.com/the_behnaaz_store
              </a>
            </div>

            <div className="rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                Phone
              </p>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="mt-2 inline-block text-lg font-medium text-[#1C1410] hover:text-[#B9766D]"
              >
                {PHONE_NUMBER}
              </a>
            </div>

            <div className="rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                Hours
              </p>
              <p className="mt-2 text-lg font-medium text-[#1C1410]">
                Open daily 10:30 AM to 9:30 PM
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#C8847A] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#B9766D]"
            >
              Chat on WhatsApp
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#C8AFA7] bg-[#F8F1ED] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-[#5E4149] transition hover:bg-[#F0E2DC]"
            >
              Open Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
