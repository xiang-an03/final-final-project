import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "理想型明星配對",
  description: "回答幾個理想型問題，找出你的亞洲明星性格配對。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
