"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "#fff",
          borderBottom: "1px solid #EDE8E4",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Behnaaz"
            width={60}
            height={60}
            style={{ objectFit: "contain", borderRadius: "50%" }}
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#5C4A42",
                textDecoration: "none",
                fontWeight: "400",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* WHATSAPP BUTTON - desktop only */}
        <a
          href="https://wa.me/918619279790"
          target="_blank"
          className="desktop-nav"
          style={{
            background: "#C8847A",
            color: "#fff",
            padding: "8px 18px",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: "2px",
          }}
        >
          WhatsApp Us
        </a>

        {/* HAMBURGER - mobile only */}
        <button
          onClick={() => setOpen(true)}
          className="mobile-menu-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "none",
          }}
        >
          <svg width="24" height="24" fill="none" stroke="#1C1410" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* FULLSCREEN MOBILE MENU OVERLAY */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#1C1410",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0px",
            animation: "mobileMenuSlideIn 0.3s ease forwards",
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <svg width="28" height="28" fill="none" stroke="#FAF7F4" strokeWidth="2">
              <line x1="4" y1="4" x2="24" y2="24" />
              <line x1="24" y1="4" x2="4" y2="24" />
            </svg>
          </button>

          {/* LOGO IN MENU */}
          <Image
            src="/logo.png"
            alt="Behnaaz"
            width={80}
            height={80}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
              marginBottom: "40px",
              border: "2px solid #C8847A",
            }}
          />

          {/* NAV LINKS */}
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                color: "#FAF7F4",
                textDecoration: "none",
                fontSize: "24px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                fontFamily: "serif",
                fontWeight: "300",
                padding: "16px 0",
                borderBottom: i < links.length - 1 ? "1px solid #2C2020" : "none",
                width: "80%",
                textAlign: "center",
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* WHATSAPP BUTTON IN MENU */}
          <a
            href="https://wa.me/918619279790"
            target="_blank"
            style={{
              marginTop: "40px",
              background: "#25D366",
              color: "#fff",
              padding: "14px 40px",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "4px",
              fontFamily: "sans-serif",
            }}
          >
            WhatsApp Us
          </a>
        </div>
      )}

      <style>{`
        @keyframes mobileMenuSlideIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media(min-width: 769px) {
          .mobile-menu-btn { display: none !important }
          .desktop-nav { display: flex !important }
        }
        @media(max-width: 768px) {
          .mobile-menu-btn { display: block !important }
          .desktop-nav { display: none !important }
        }
      `}</style>
    </>
  );
}
