import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/providers/userProvider";
import LayoutFile from "@/components/teacher/LayoutFile";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "AppInfoLogic",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <ToastContainer />
      <UserProvider>
        {" "}
        <LayoutFile>{children}</LayoutFile>
      </UserProvider>
    </div>
  );
}
