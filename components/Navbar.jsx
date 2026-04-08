"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #EDE8E4",
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "serif",
          fontSize: "26px",
          fontWeight: 300,
          letterSpacing: "4px",
          color: "#1C1410",
          textDecoration: "none",
        }}
      >
        Behn<span style={{ color: "#C8847A" }}>aa</span>z
      </Link>

      <div style={{ display: "flex", gap: "32px" }} className="desk-links">
        {["/", "/products", "/categories", "/contact"].map((href, i) => (
          <Link
            key={i}
            href={href}
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
