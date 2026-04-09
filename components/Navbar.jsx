"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav
      className="motion-nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #EDE8E4",
        padding: "0 40px",
        height: "84px",
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
          alt="Behnaaz"
          width={80}
          height={80}
          style={{
            objectFit: "contain",
            borderRadius: "50%",
            border: "2px solid #EDE8E4",
          }}
          priority
        />
      </Link>

      <div
        style={{ display: "flex", alignItems: "center", gap: "32px" }}
        className="desk-links"
      >
        {["/", "/products", "/categories", "/contact"].map((href, i) => (
          <Link
            key={i}
            href={href}
            className="motion-underline-link"
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#5C4A42",
              textDecoration: "none",
            }}
          >
            {["Home", "Products", "Categories", "Contact"][i]}
          </Link>
        ))}
      </div>

      <a
        href="https://wa.me/918619279790"
        target="_blank"
        rel="noopener noreferrer"
        className="motion-button"
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

      <style>{`
        @media(max-width:768px){
          .desk-links{display:none !important}
        }
      `}</style>
    </nav>
  );
}
