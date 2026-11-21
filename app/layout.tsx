import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { OrganizationDataProvider } from "./components/use-organization-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Organization & Infrastructure | ASARA",
  description:
    "Manage organization roles, team skills, equipment, and operational gaps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <OrganizationDataProvider>{children}</OrganizationDataProvider>
      </body>
    </html>
  );
}
