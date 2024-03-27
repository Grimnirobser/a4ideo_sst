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
<<<<<<< HEAD
            <Toaster />
=======
          {/* <Web3provider> */}
            <Toaster toastOptions={{ position: "bottom-right" }} />
>>>>>>> c4deca6 (currently hide web3 stuff)
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
<<<<<<< HEAD
=======
            {/* </Web3provider> */}
>>>>>>> c4deca6 (currently hide web3 stuff)
        </Provider>
      </body>
    </html>
  );
}
