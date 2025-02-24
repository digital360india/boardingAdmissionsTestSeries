import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/providers/userProvider";
import LayoutFile from "@/components/teacher/LayoutFile";
import 'react-toastify/dist/ReactToastify.css';
import { TestSeriesProvider } from "@/providers/testSeriesProvider";
import { TestProvider } from "@/providers/testProvider";

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "BoardingAdmissions",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <ToastContainer />
      <UserProvider>
        <TestProvider>
        <TestSeriesProvider>
        <LayoutFile>{children}</LayoutFile>
        </TestSeriesProvider>
        </TestProvider>
      </UserProvider>
    </div>
  );
}
