import Navigation from "@/components/shared/Navigation/Navigation";
import "./globals.css";
import { Roboto } from "next/font/google";
import CurrentUserProvider from "@/context/CurrentUserContext";
import getCurrentUser from "@/actions/getCurrentUser";
import { Toaster } from "react-hot-toast";
import getCurrentChannel from "@/actions/getCurrentChannel";
import CurrentChannelProvider from "@/context/CurrentChannelContext";
import SidebarProvider from "@/context/SidebarContext";
import { Web3provider } from "@/context/Web3Provider";
import { constructMetadata } from "@/utils/websiteUtils";
import Provider from "@/context/Provider";
import ProgressBarProvider from "@/context/ProgressBarProvider";


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

  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider> 
          <Web3provider>
            <Toaster toastOptions={{ position: "bottom-right" }} />
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
            </Web3provider>
        </Provider>
      </body>
    </html>
  );
}
