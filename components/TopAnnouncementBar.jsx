"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "behnaaz-top-offer-dismissed-v1";
const WHATSAPP_LINK = "https://wa.me/918619279790";
const OFFER_TEXT =
  "✦ SPECIAL OFFER — Flat 10% OFF on all products Use code: BEHNAAZ10 ✦ Shop now on WhatsApp";

export default function TopAnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(DISMISS_KEY);
      if (dismissed === "1") {
        setIsVisible(false);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);

    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore localStorage access errors and only dismiss for current render.
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="announcement-bar" role="region" aria-label="Special offer">
      <div className="announcement-marquee-wrap">
        <div className="announcement-marquee-track">
          {Array.from({ length: 3 }).map((_, index) => (
            <a
              key={index}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="announcement-item"
              aria-label="Shop now on WhatsApp"
            >
              {OFFER_TEXT}
            </a>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="announcement-dismiss"
        aria-label="Close special offer banner"
      >
        X
      </button>
    </div>
  );
}
