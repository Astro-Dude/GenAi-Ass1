import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scaler Personas — Chat with Anshuman, Abhimanyu & Kshitij",
  description:
    "A persona-based AI chatbot that lets you have real conversations with three Scaler / InterviewBit personalities — Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
