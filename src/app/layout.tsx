'use client';
import "./globals.css";
import NavBar from "./components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { UserProvider } from "./context/UserContext";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <QueryClientProvider client={queryClient}>
            <NavBar />
            {children}
            <Footer />
          </QueryClientProvider>
        </body>
      </html>
    </UserProvider>
  );
}
