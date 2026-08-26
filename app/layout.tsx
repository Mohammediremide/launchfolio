import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Launchfolio — publish work with confidence", description: "Organize projects and publish them to GitHub without Git commands.", icons: { icon: "/icon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
