const WHATSAPP_URL =
  "https://wa.me/918619279790?text=Hi! I visited Behnaaz website and I am interested in your collection. Can you help me?";
const INSTAGRAM_URL = "https://instagram.com/the_behnaaz_store";
const PHONE_NUMBER = "+91 8619279790";
const STORE_ADDRESS_LINE_1 = "16/1137, Meera Colony, Ayad,";
const STORE_ADDRESS_LINE_2 = "Udaipur, Rajasthan - 313001";

export default function ContactPage() {
  return (
    <div className="motion-pop min-h-screen bg-[#FAF7F4] px-4 py-12 text-[#1C1410] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="motion-enter rounded-3xl border border-[#E9DCD6] bg-gradient-to-br from-[#F8EEEC] via-[#F6ECE6] to-[#F4E5DE] p-6 shadow-sm sm:p-10">
          <p className="motion-enter text-xs font-semibold uppercase tracking-[0.2em] text-[#B8965A]">
            Behnaaz Contact
          </p>
          <h1 className="motion-enter motion-delay-1 mt-3 text-4xl text-[#1C1410] [font-family:var(--font-cormorant)] sm:text-5xl">
            Let&apos;s Connect
          </h1>
          <p className="motion-enter motion-delay-2 mt-3 max-w-2xl text-sm leading-relaxed text-[#6E5A64] sm:text-base">
            Reach out for product details, styling help, and order support. We
            are available every day for your shopping queries.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div
              className="motion-card motion-sheen rounded-2xl border border-[#E8D9D3] bg-white/80 p-5 backdrop-blur-sm md:col-span-2"
              style={{ animationDelay: "35ms" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                Address
              </p>
              <p className="mt-2 text-lg font-semibold text-[#1C1410]">
                <span className="mr-2" aria-hidden="true">
                  📍
                </span>
                {STORE_ADDRESS_LINE_1}
              </p>
              <p className="text-lg font-semibold text-[#1C1410]">
                {STORE_ADDRESS_LINE_2}
              </p>
            </div>

            <div
              className="motion-card motion-sheen rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm"
              style={{ animationDelay: "70ms" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                WhatsApp
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="motion-underline-link mt-2 inline-block text-lg font-medium text-[#1C1410] hover:text-[#B9766D]"
              >
                wa.me/918619279790
              </a>
            </div>

            <div
              className="motion-card motion-sheen rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm"
              style={{ animationDelay: "140ms" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                Instagram
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="motion-underline-link mt-2 inline-block text-lg font-medium text-[#1C1410] hover:text-[#B9766D]"
              >
                instagram.com/the_behnaaz_store
              </a>
            </div>

            <div
              className="motion-card motion-sheen rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm"
              style={{ animationDelay: "210ms" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A72]">
                Phone
              </p>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="motion-underline-link mt-2 inline-block text-lg font-medium text-[#1C1410] hover:text-[#B9766D]"
              >
                {PHONE_NUMBER}
              </a>
            </div>

            <div
              className="motion-card motion-sheen rounded-2xl border border-[#E8D9D3] bg-white/70 p-5 backdrop-blur-sm"
              style={{ animationDelay: "280ms" }}
            >
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
              className="motion-button inline-flex w-full items-center justify-center rounded-full bg-[#C8847A] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#B9766D]"
            >
              Chat on WhatsApp
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="motion-button inline-flex w-full items-center justify-center rounded-full border border-[#C8AFA7] bg-[#F8F1ED] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-[#5E4149] transition hover:bg-[#F0E2DC]"
            >
              Open Instagram
            </a>
          </div>

          <div style={{ marginTop: "16px" }}>
            <a
              href="https://maps.app.goo.gl/UZPYjNuiXYCjGotw8"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#C8847A",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
                marginBottom: "16px",
              }}
            >
              📍 Open Exact Location →
            </a>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.5!2d73.71526!3d24.58761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM1JzE1LjQiTiA3M8KwNDMnMDIuOCJF!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="320"
              style={{
                border: "none",
                borderRadius: "12px",
                display: "block",
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <p
              style={{
                fontSize: "11px",
                color: "#8C7670",
                marginTop: "8px",
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              16/1137 Meera Colony, Ayad,
              Udaipur, Rajasthan 313001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
