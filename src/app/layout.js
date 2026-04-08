import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://behnaaz.in";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Behnaaz - Ladies Kurti Shop",
  description:
    "Explore elegant kurtis and kurti sets at Behnaaz. Shop Easy Wear Sets, Co-ord Sets, Festive Wear and more.",
  openGraph: {
    title: "Behnaaz - Ladies Kurti Shop",
    description:
      "Explore elegant kurtis and kurti sets at Behnaaz. Shop Easy Wear Sets, Co-ord Sets, Festive Wear and more.",
    url: "/",
    siteName: "Behnaaz",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "Behnaaz logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behnaaz - Ladies Kurti Shop",
    description:
      "Explore elegant kurtis and kurti sets at Behnaaz. Shop Easy Wear Sets, Co-ord Sets, Festive Wear and more.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${jost.variable} flex min-h-screen flex-col antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
