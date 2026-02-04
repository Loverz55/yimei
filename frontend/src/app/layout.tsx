import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const inter = localFont({
  src: [
    {
      path: "../assets/fonts/robot.ttf",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AesthetiCore - 医美智能操作系统",
  description: "医美诊所一体化 AI 智能操作系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="antialiased font-sans">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
