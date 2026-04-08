"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin() {
    if (password === "behnaaz2025") {
      sessionStorage.setItem("admin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF7F4",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          border: "1px solid #EDE8E4",
          width: "340px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "serif",
            fontSize: "28px",
            fontWeight: 300,
            letterSpacing: "4px",
            marginBottom: "8px",
          }}
        >
          Behn<span style={{ color: "#C8847A" }}>aa</span>z
        </h1>
        <p style={{ color: "#8C7670", fontSize: "13px", marginBottom: "28px" }}>
          Admin Panel
        </p>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #EDE8E4",
            borderRadius: "4px",
            fontSize: "14px",
            marginBottom: "12px",
            outline: "none",
            fontFamily: "sans-serif",
          }}
        />
        {error && (
          <p
            style={{ color: "#C8847A", fontSize: "12px", marginBottom: "12px" }}
          >
            {error}
          </p>
        )}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "#1C1410",
            color: "#fff",
            padding: "12px",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Enter Admin Panel
        </button>
      </div>
    </div>
  );
}
