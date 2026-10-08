import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <>
      <body>{children}</body>
      </>
    </html>
  );
}
