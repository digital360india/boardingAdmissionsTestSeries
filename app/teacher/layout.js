import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/providers/userProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "BoardingAdmissions",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <ToastContainer />
      <UserProvider>{children}</UserProvider>
    </div>
  );
}
