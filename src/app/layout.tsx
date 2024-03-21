import Navigation from "@/components/shared/Navigation/Navigation";
import "./globals.css";
import { Roboto } from "next/font/google";
import CurrentUserProvider from "@/context/CurrentUserContext";
import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentChannel from "@/actions/getCurrentChannel";
import CurrentChannelProvider from "@/context/CurrentChannelContext";
import SidebarProvider from "@/context/SidebarContext";
import { constructMetadata } from "@/utils/websiteUtils";
import Provider from "@/context/Provider";
import ProgressBarProvider from "@/context/ProgressBarProvider";
import { submitAttemptInitAction } from "@/actions/submitAttempt";
import { Toaster } from "@/components/ui/toaster"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const currentChannel = await getCurrentChannel();

  await submitAttemptInitAction();

  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider> 
            <Toaster />
            <CurrentUserProvider user={currentUser}>
              <CurrentChannelProvider channel={currentChannel}>
                {/* <UploadVideoModalProvider> */}
                   <ProgressBarProvider>
                      <SidebarProvider>
                        <Navigation />
                        <div className="pt-16">
                          {children}
                        </div>
                      </SidebarProvider>
                  </ProgressBarProvider>
                {/* </UploadVideoModalProvider> */}
              </CurrentChannelProvider>
            </CurrentUserProvider>
        </Provider>
      </body>
    </html>
  );
}
