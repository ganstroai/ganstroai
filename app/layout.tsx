import type React from "react";
import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";
import { Provider } from "jotai";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GanStró AI Assistant - Premium AI Voice Platform",
  description: "Advanced AI-powered voice assistant with subscription packages",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={baiJamjuree.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
