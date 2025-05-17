import "./globals.css";

import { Space_Grotesk } from "next/font/google";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "variable",
});

export const metadata = {
  title: "MIT Hacks 2025",
  description:
    "Join us for MIT Hacks 2025, a 36-hour hackathon at MIT University where innovation comes to life.",
  keywords: [
    "MIT hacks",
    "hackathon",
    "MIT university",
    "coding",
    "programming",
    "innovation",
    "MIT hackathon",
    "atlanta",
    "MIT university",
    "MIT",
    "software",
    "contest",
    "competition",
    "atlanta hackathon",
    "atl hackathon",
    "atlanta coding",
    "computer science",
    "atlanta"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "MIT Hacks 2025",
    description:
      "Join us for MIT Hacks 2025, a 36-hour hackathon at MIT University where innovation comes to life.",
    url: "https://www.MIThacks.com",
    site_name: "MIT Hacks 2025",
    images: [
      {
        url: "https://www.MIThacks.com/thumbnail.png",
        width: 800,
        height: 800,
        alt: "MIT Hacks",
      },
    ],
    locale: "en_us",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MIT Hacks 2025" />
        <meta
          name="twitter:description"
          content="Join us for MIT Hacks 2025, a 36-hour hackathon at MIT University where innovation comes to life."
        />
        <meta
          name="twitter:image"
          content="https://www.MIThacks.com/thumbnail.png"
        />
      </Head>

      <body className={`${spaceGrotesk.className} antialiased w-screen bg-bg`}>
        {children}
      </body>
    </html>
  );
}
