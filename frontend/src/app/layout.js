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
  title: "Kite — Connect with Friends and the World",
  description: "A modern, vibrant social platform like Facebook featuring news feed, stories, real-time reactions, messenger chat, and community marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f0f2f5] dark:bg-[#18191a] text-zinc-900 dark:text-[#e4e6eb] selection:bg-[#1877f2]/20 selection:text-[#1877f2]">
        {children}
      </body>
    </html>
  );
}
