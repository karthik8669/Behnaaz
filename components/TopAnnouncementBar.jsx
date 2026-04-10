export default function TopAnnouncementBar() {
  return (
    <div
      style={{
        background: "#1C1410",
        padding: "10px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "marquee 25s linear infinite",
        }}
      >
        {[1, 2, 3].map((i) => (
          <span key={i} style={{ marginRight: "0" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#F5EAE8",
              }}
            >
              ✦ SPECIAL OFFER — UPTO 10% OFF ON ALL PRODUCTS
            </span>
            <span style={{ color: "#C8847A", margin: "0 16px" }}>
              USE CODE: BEHNAAZ10
            </span>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#F5EAE8",
              }}
            >
              ✦ SHOP NOW ON WHATSAPP
            </span>
            <span style={{ color: "#B8965A", margin: "0 32px" }}>❋</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-33.33%) }
        }
      `}</style>
    </div>
  );
}
