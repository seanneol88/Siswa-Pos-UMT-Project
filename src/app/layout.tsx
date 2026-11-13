import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Siswa Pos | Parcel operations, made accountable",
    template: "%s | Siswa Pos",
  },
  description:
    "An academic prototype for faster, accountable student parcel collection workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
