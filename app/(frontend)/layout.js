import { UserProvider } from "@/providers/userProvider";
import "./globals.css";
import { TestProvider } from "@/providers/testProvider";
import Navbar from "@/components/frontend/NavBar";
import { TestSeriesProvider } from "@/providers/testSeriesProvider";

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <UserProvider>
        <TestProvider>
          <TestSeriesProvider>
          <div>
            <Navbar />
            {children}
          </div>
          </TestSeriesProvider>
        </TestProvider>
      </UserProvider>
    </div>
  );
}
