"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <>
      <body>{mounted ? children : null}</body>
      </>
    </html>
  );
}
