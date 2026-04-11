"use client";

import Link from "next/link";
import Image from "next/image";

const PHONE_DISPLAY = "+91 861 927 9790";
const PHONE_DIAL = "+918619279790";
const WHATSAPP_LINK =
  "https://wa.me/918619279790?text=Hi! I visited Behnaaz website and I am interested in your collection. Can you help me?";
const INSTAGRAM_LINK =
  "https://www.instagram.com/the_behnaaz_store?igsh=cG1qeWt3ZG1td2t4";
const STORE_ADDRESS_LINE_1 = "16/1137, Meera Colony, Ayad,";
const STORE_ADDRESS_LINE_2 = "Udaipur, Rajasthan - 313001";

const COLLECTION_LINKS = [
  "Easy Wear Sets",
  "Chic Co-ord Sets",
  "Festive / Wedding Wear",
  "Casual Wear",
  "Short Kurties",
  "Sale / Discounts",
  "Best Sellers",
].map((category) => ({
  label: category,
  href: `/products?category=${encodeURIComponent(category)}`,
}));

const QUICK_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Categories", href: "/#categories" },
  { label: "Products", href: "/#products" },
  { label: "About", href: "/#owner-quote" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm-.13 1.9A3.73 3.73 0 0 0 3.9 7.62v8.76A3.73 3.73 0 0 0 7.62 20.1h8.76a3.73 3.73 0 0 0 3.72-3.72V7.62a3.73 3.73 0 0 0-3.72-3.72H7.62Zm8.96 1.43a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1ZM12 7.14A4.86 4.86 0 1 1 7.14 12 4.86 4.86 0 0 1 12 7.14Zm0 1.9A2.96 2.96 0 1 0 14.96 12 2.96 2.96 0 0 0 12 9.04Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.8 11.8 0 0 0 12.09 0C5.67 0 .44 5.21.44 11.63c0 2.05.54 4.06 1.56 5.83L0 24l6.74-1.96a11.57 11.57 0 0 0 5.35 1.28h.01c6.42 0 11.64-5.22 11.65-11.64.01-3.11-1.2-6.03-3.23-8.2Zm-8.43 17.87h-.01a9.64 9.64 0 0 1-4.92-1.35l-.35-.2-4 .97 1.07-3.89-.23-.4a9.65 9.65 0 0 1-1.48-5.16c0-5.33 4.34-9.66 9.68-9.66a9.62 9.62 0 0 1 6.83 2.82 9.6 9.6 0 0 1 2.82 6.84c0 5.33-4.34 9.66-9.67 9.67Zm5.3-7.24c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.73.94-.89 1.13-.16.19-.32.22-.61.07-.29-.14-1.21-.45-2.3-1.43-.85-.76-1.43-1.7-1.59-1.99-.17-.29-.02-.45.12-.59.13-.13.29-.32.43-.48.14-.16.19-.28.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.37s1.01 2.75 1.15 2.94c.14.19 1.98 3.03 4.8 4.25.67.29 1.2.46 1.61.59.68.22 1.29.19 1.78.12.54-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.06-.12-.25-.19-.54-.33Z"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="motion-enter bg-[#141010] text-[#f4e8e0]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center sm:text-left">
            <Link
              href="/"
              aria-label="Behnaaz home"
              className="motion-button inline-flex w-full items-center justify-center sm:w-auto sm:justify-start"
            >
              <Image
                src="/logo.png"
                alt="Behnaaz"
                width={100}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </Link>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#d6c2b8] sm:mx-0">
              Elegant kurti collections crafted for every day, every
              celebration, and every beautiful moment.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Behnaaz on Instagram"
                className="motion-icon-pop inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#b8965a]/40 text-[#f4e8e0] transition hover:border-[#c8847a] hover:text-[#c8847a]"
              >
                <InstagramIcon />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Behnaaz on WhatsApp"
                className="motion-icon-pop inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#b8965a]/40 text-[#f4e8e0] transition hover:border-[#c8847a] hover:text-[#c8847a]"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg text-[#f8eee8] [font-family:var(--font-cormorant)]">
              Collections
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[#d6c2b8]">
              {COLLECTION_LINKS.map((item, index) => (
                <li
                  key={item.label}
                  className="motion-enter"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Link
                    href={item.href}
                    className="motion-underline-link transition hover:text-[#c8847a]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg text-[#f8eee8] [font-family:var(--font-cormorant)]">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[#d6c2b8]">
              {QUICK_LINKS.map((item, index) => (
                <li
                  key={item.label}
                  className="motion-enter"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Link
                    href={item.href}
                    className="motion-underline-link transition hover:text-[#c8847a]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="contact">
            <h3 className="text-lg text-[#f8eee8] [font-family:var(--font-cormorant)]">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[#d6c2b8]">
              <li className="leading-relaxed text-[#d6c2b8]">
                <span className="mr-1 text-[#c8847a]">📍</span>
                {STORE_ADDRESS_LINE_1}
                <br />
                {STORE_ADDRESS_LINE_2}
              </li>
              <li>
                <a
                  href={`tel:${PHONE_DIAL}`}
                  className="motion-underline-link transition hover:text-[#c8847a]"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-underline-link transition hover:text-[#c8847a]"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-underline-link transition hover:text-[#c8847a]"
                >
                  @the_behnaaz_store
                </a>
              </li>
              <li className="pt-1 text-[#b8965a]">
                Open daily, 10:30 AM to 9:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2b201c] pt-5 text-center text-xs text-[#b8a398]">
          © 2026 Behnaaz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
