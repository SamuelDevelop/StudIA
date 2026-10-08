import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "StudIA - Estudos com Inteligência Artificial Local",
  description: "Gere estudos completos com conteúdo didático, flashcards e questionários com IA local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
