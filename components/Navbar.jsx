"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const WHATSAPP_LINK =
  "https://wa.me/918619279790?text=Hi! I visited Behnaaz website and I am interested in your collection. Can you help me?";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/contact", label: "Contact" },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className="motion-nav main-nav"
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: "100%",
        boxSizing: "border-box",
        overflow: "visible",
        background: "#fff",
        borderBottom: "1px solid #EDE8E4",
        padding: "0 40px",
        minHeight: "84px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        aria-label="Behnaaz home"
        className="motion-button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        <Image
          src="/logo.png"
          alt="Behnaaz logo"
          width={70}
          height={70}
          className="nav-logo"
          style={{ objectFit: "contain" }}
          priority
        />
      </Link>

      <div
        style={{ display: "flex", alignItems: "center", gap: "32px" }}
        className="desk-links"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="motion-underline-link"
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#5C4A42",
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="mobile-toggle"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 7H20"
            stroke="#5C4A42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 12H20"
            stroke="#5C4A42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 17H20"
            stroke="#5C4A42"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="motion-button nav-whatsapp"
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

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleMobileLinkClick}
            className="motion-underline-link"
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#5C4A42",
              textDecoration: "none",
              padding: "12px 0",
              borderBottom: "1px solid #F2EEEA",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={`mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-overlay-header">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-overlay-close"
            aria-label="Close menu"
          >
            X
          </button>
        </div>

        <div className="mobile-overlay-links">
          {navLinks.map((link) => (
            <Link
              key={`overlay-${link.href}`}
              href={link.href}
              onClick={handleMobileLinkClick}
              className="mobile-overlay-link"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-overlay-whatsapp"
          onClick={handleMobileLinkClick}
        >
          WhatsApp Us
        </a>
      </div>

      <style>{`
        .mobile-toggle {
          display: none;
          border: none;
          background: transparent;
          padding: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu {
          display: none;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 250;
          display: flex;
          flex-direction: column;
          background: #fff;
          padding: 18px 18px 22px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .mobile-overlay-header {
          display: flex;
          justify-content: flex-end;
        }

        .mobile-overlay-close {
          border: 1px solid #e6d7d1;
          background: #fff;
          color: #5c4a42;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .mobile-overlay-links {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-overlay-link {
          text-decoration: none;
          color: #5c4a42;
          border: 1px solid #efe5e1;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .mobile-overlay-whatsapp {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 10px;
          text-decoration: none;
          background: #c8847a;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        @media (min-width: 769px) {
          .mobile-overlay {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desk-links {
            display: none !important;
          }

          .nav-whatsapp {
            display: none !important;
          }

          .main-nav {
            padding: 0 14px !important;
            min-height: 80px !important;
          }

          .mobile-toggle {
            display: inline-flex !important;
          }

          .nav-logo {
            width: 70px !important;
            height: 70px !important;
          }

          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
