import LayoutFile from "@/components/admin/LayoutFile";
import { ProfileProvider } from "@/providers/profileProvider";
import { TestProvider } from "@/providers/testProvider";
import { TestSeriesProvider } from "@/providers/testSeriesProvider";
import { UserProvider } from "@/providers/userProvider";
import "../../globals.css";

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "BoardingAdmissions",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en" className="bg-[#f5f5f5]">
      <UserProvider>
        <TestProvider>
          <TestSeriesProvider>
            <ProfileProvider>
              <LayoutFile>{children}</LayoutFile>
            </ProfileProvider>
          </TestSeriesProvider>
        </TestProvider>
      </UserProvider>
    </div>
  );
}
