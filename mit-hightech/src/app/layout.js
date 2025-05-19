import {
  ClerkProvider,
} from '@clerk/nextjs'
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "variable",
});

export const metadata = {
  title: "MIT Hi-Tech 2025",
  description:
    "Join us for MIT Hi-Tech 2025, a vibrant fusion of technology, creativity, and intellect at Moradabad Institute of Technology.",
  keywords: [
    "MIT event",
    "Hi-Tech Event",
    "Moradabad Institute of Technology",
    "coding",
    "programming",
    "innovation",
    "MIT technical event",
    "Moradabad",
    "Moradabad Institute of Technology",
    "MIT",
    "Codeathon",
    "Ideathon",
    "Projectathon",
    "debate",
    "technical presentation",
    "contest",
    "competition",
    "Moradabad hackathon",
    "computer science",
    "technology event"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "MIT Hi-Tech 2025",
    description:
      "Join us for MIT Hi-Tech 2025, a vibrant fusion of technology, creativity, and intellect at Moradabad Institute of Technology.",
    url: "https://hi-tech-mit.vercel.app/",
    site_name: "MIT Hi-Tech 2025",
    images: [
      {
        url: "https://hi-tech-mit.vercel.app/image.png",
        width: 800,
        height: 800,
        alt: "MIT Hi-Tech",
      },
    ],
    locale: "en_in",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MIT Hi-Tech 2025" />
        <meta
          name="twitter:description"
          content="Join us for MIT Hi-Tech 2025, a vibrant fusion of technology, creativity, and intellect at Moradabad Institute of Technology."
        />
        <meta
          name="twitter:image"
          content="https://hi-tech-mit.vercel.app/image.png"
        />
      </Head>
      
      <body className={`${spaceGrotesk.className} antialiased w-screen bg-bg`}>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}