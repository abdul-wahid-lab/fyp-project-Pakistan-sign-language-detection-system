import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";

const fredoka = Fredoka({
  weight: ['400','500','600','700'],
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400','500','600','700','800'],
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  weight: ['400','500','700'],
  subsets: ['arabic'],
  variable: '--font-nastaliq',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "LinguaSign — Pakistan Sign Language",
  description: "Detect and learn Pakistan Sign Language with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${plusJakarta.variable} ${notoNastaliq.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
