"use client";

import { useState } from "react";

export default function OrderModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const sizes =
    product.sizes?.length > 0 ? product.sizes : ["S", "M", "L", "XL", "XXL"];

  function handleOrder() {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    const totalPrice = product.price * quantity;

    const message = `🛍️ *NEW ORDER — BEHNAAZ*
  ━━━━━━━━━━━━━━━━━━━━
  📦 *PRODUCT DETAILS*
  - Name: ${product.name}
  - Category: ${product.category}
  - Size Selected: ${selectedSize}
  - Quantity: ${quantity}
  - Price per piece: ₹${product.price}
  - 💰 Total: ₹${totalPrice}
  ━━━━━━━━━━━━━━━━━━━━
  🖼️ *PRODUCT IMAGE*
  ${product.image_url}
  ━━━━━━━━━━━━━━━━━━━━
  🌐 *VIEW ON WEBSITE*
  https://behnaaz.vercel.app/products
  ━━━━━━━━━━━━━━━━━━━━
  Please confirm availability
  and share payment details.
  Thank you! 🙏`;

    const whatsappUrl = `https://wa.me/918619279790?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    onClose();
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998,
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          padding: "24px 20px",
          zIndex: 9999,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontFamily: "serif",
              fontSize: "20px",
              fontWeight: "400",
              color: "#1C1410",
            }}
          >
            Place Order
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#8C7670",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            background: "#FAF7F4",
            border: "1px solid #EDE8E4",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
          }}
        >
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: "64px",
                height: "64px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#1C1410",
                marginBottom: "4px",
              }}
            >
              {product.name}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#B8965A",
                fontWeight: "600",
              }}
            >
              ₹{product.price} per piece
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "#8C7670",
              }}
            >
              {product.category}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#8C7670",
              marginBottom: "10px",
            }}
          >
            Select Size *
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setError("");
                }}
                style={{
                  padding: "10px 18px",
                  fontSize: "13px",
                  border: "1px solid #EDE8E4",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: selectedSize === size ? "#1C1410" : "#fff",
                  color: selectedSize === size ? "#fff" : "#1C1410",
                  fontWeight: selectedSize === size ? "600" : "400",
                  transition: "all 0.15s",
                }}
              >
                {size}
              </button>
            ))}
          </div>
          {error && (
            <p
              style={{
                color: "#C8847A",
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#8C7670",
              marginBottom: "10px",
            }}
          >
            Quantity
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
            }}
          >
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid #EDE8E4",
                borderRadius: "6px 0 0 6px",
                background: "#FAF7F4",
                fontSize: "18px",
                cursor: "pointer",
                color: "#1C1410",
              }}
            >
              -
            </button>
            <div
              style={{
                width: "60px",
                height: "40px",
                border: "1px solid #EDE8E4",
                borderLeft: "none",
                borderRight: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1C1410",
              }}
            >
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid #EDE8E4",
                borderRadius: "0 6px 6px 0",
                background: "#FAF7F4",
                fontSize: "18px",
                cursor: "pointer",
                color: "#1C1410",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FAF7F4",
            border: "1px solid #EDE8E4",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#8C7670",
            }}
          >
            Total Amount
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#B8965A",
            }}
          >
            ₹{product.price * quantity}
          </span>
        </div>

        <button
          type="button"
          onClick={handleOrder}
          style={{
            width: "100%",
            background: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "14px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "sans-serif",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          💬 Confirm Order on WhatsApp
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#8C7670",
            marginTop: "10px",
          }}
        >
          You will be redirected to WhatsApp with your order details
        </p>
      </div>
    </>
  );
}
