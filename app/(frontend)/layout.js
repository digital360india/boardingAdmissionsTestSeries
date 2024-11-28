import { UserProvider } from "@/providers/userProvider";
import "./globals.css";
import { TestProvider } from "@/providers/testProvider";
import Navbar from "@/components/frontend/NavBar";

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <UserProvider>
        <TestProvider>
          <div>
            <Navbar />
            {children}
          </div>
        </TestProvider>
      </UserProvider>
    </div>
  );
}
