import { ProfileProvider } from "@/providers/profileProvider";
import { TestProvider } from "@/providers/testProvider";
import { TestSeriesProvider } from "@/providers/testSeriesProvider";
import { UserProvider } from "@/providers/userProvider";
export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "AppInfoLogic",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <UserProvider>
        <TestProvider>
          <TestSeriesProvider>
            <ProfileProvider>{children}</ProfileProvider>
          </TestSeriesProvider>
        </TestProvider>
      </UserProvider>
    </div>
  );
}
