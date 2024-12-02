import "../../globals.css";

import LayoutFile from "@/components/admin/LayoutFile";
import { ProfileContext, ProfileProvider } from "@/providers/profileProvider";
import { UserProvider } from "@/providers/userProvider";

export const metadata = {
  icons: [{ rel: "icon", url: "./Ace.svg" }],

  title: "BoardingAdmissions",
};

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      {" "}
      <UserProvider>
        <LayoutFile>
          <ProfileProvider> {children}</ProfileProvider>
        </LayoutFile>
      </UserProvider>
    </div>
  );
}
