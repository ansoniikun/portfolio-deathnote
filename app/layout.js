import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hlompho Maleke - Death Note Portfolio",
  description: "Full-stack developer portfolio with a unique Death Note theme. Explore my projects, skills, and creative approach to web development.",
  keywords: ["portfolio", "developer", "full-stack", "web development", "Death Note", "Hlompho Maleke"],
  authors: [{ name: "Hlompho Maleke" }],
  creator: "Hlompho Maleke",
  publisher: "Hlompho Maleke",
  robots: "index, follow",
  openGraph: {
    title: "Hlompho Maleke - Death Note Portfolio",
    description: "Full-stack developer portfolio with a unique Death Note theme. Explore my projects, skills, and creative approach to web development.",
    url: "https://hlomphomaleke.co.za",
    siteName: "Hlompho Maleke Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Hlompho Maleke - Death Note Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hlompho Maleke - Death Note Portfolio",
    description: "Full-stack developer portfolio with a unique Death Note theme. Explore my projects, skills, and creative approach to web development.",
    images: ["/logo.png"],
    creator: "@yourtwitterhandle", // Replace with your Twitter handle
    site: "@yourtwitterhandle", // Replace with your Twitter handle
  },
  linkedin: {
    title: "Hlompho Maleke - Death Note Portfolio",
    description: "Full-stack developer portfolio with a unique Death Note theme. Explore my projects, skills, and creative approach to web development.",
    image: "/logo.png",
  },
  other: {
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
