import "../../globals.css";
import { UserProvider } from "@/providers/userProvider";
import LayoutFile from "@/components/backend/LayoutFile";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "BoardingAdmissions",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      {" "}
      <ToastContainer/>
      <UserProvider>
        <LayoutFile>{children}</LayoutFile>
      </UserProvider>
    </div>
  );
}
