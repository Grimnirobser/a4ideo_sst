import Navigation from "@/components/shared/Navigation/Navigation";
import "./globals.css";
import { Roboto } from "next/font/google";
import CurrentUserProvider from "@/context/CurrentUserContext";
import getCurrentUser from "@/actions/getCurrentUser";
import getCurrentChannel from "@/actions/getCurrentChannel";
import CurrentChannelProvider from "@/context/CurrentChannelContext";
import SidebarProvider from "@/context/SidebarContext";
import { constructMetadata } from "@/lib/websiteUtils";
import Provider from "@/context/Provider";
import ProgressBarProvider from "@/context/ProgressBarProvider";
import { submitAttemptInitAction } from "@/actions/submitAttempt";
import { Toaster } from "@/components/ui/toaster"
import { checkVideoDeletableInitAction } from "@/actions/checkVideoDeletable";
import { checkProblemsetDeletableInitAction } from "@/actions/checkProblemsetDeletable";
import SignInOptionProvider from "@/context/SignInOptionContext";

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
  await checkVideoDeletableInitAction();
  await checkProblemsetDeletableInitAction();

  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider> 
            <Toaster />
            <CurrentUserProvider user={currentUser}>
              <CurrentChannelProvider channel={currentChannel}>
                  {/* <UploadVideoModalProvider> */}
                    <ProgressBarProvider>
                        <SignInOptionProvider>
                          <SidebarProvider>
                            <Navigation />
                            <div className="pt-16 bg-slate-100 min-h-screen -z-50">
                              {children}
                            </div>
                          </SidebarProvider>
                        </SignInOptionProvider>
                    </ProgressBarProvider>
                  {/* </UploadVideoModalProvider> */}
              </CurrentChannelProvider>
            </CurrentUserProvider>
        </Provider>
      </body>
    </html>
  );
}
