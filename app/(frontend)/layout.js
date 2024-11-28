import { UserProvider } from "@/providers/userProvider";
import "./globals.css";
import { TestProvider } from "@/providers/testProvider";
import Navbar from "@/components/frontend/NavBar";
import Footer from "@/components/frontend/Footer";

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <UserProvider>
        <TestProvider>
          <div>
            <Navbar />
            {children}
            <Footer />
          </div>
        </TestProvider>
      </UserProvider>
    </div>
  );
}
