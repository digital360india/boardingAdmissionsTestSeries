import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],
  title: "BoardingAdmissions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#F5F5F5]">
      <body className={inter.className}>
        <Providers>{children}</Providers> 
      </body>
    </html>
  );
}
