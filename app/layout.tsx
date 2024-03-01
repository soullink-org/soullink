import "./globals.css";
import Footer from "@/components/common/Footer";
import NextAuthSessionProvider from "@/components/common/module/NextAuthSessionProvider";
import Header from "@/components/common/header/Header";
import ReactQueryClientProvider from "@/components/common/react-query-provider/ReactQueryClientProvider";
import RecoilRootProvider from "@/components/common/module/RecoilRootProvider";
import CommonModalProvider from "@/components/common/modal/CommonModalProvider";
import ReactQueryErrorBoundary from "@/components/common/react-query-provider/ReactQueryErrorBoundary";
import { IBM_Plex_Sans_KR, Open_Sans } from "next/font/google";
import DarkModeContainer from "@/components/common/module/DarkModeContainer";
import AuthUserNavigator from "@/components/common/module/AuthUserNavigator";
import { clsx } from "clsx";

export const metadata = {
  title: "soullink - beta",
  description: "share your playlists",
};

const OpenSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlexSansKr.className}>
      <head>
        <meta
          name="google-site-verification"
          content={process.env.GOOGLE_SITE_VERIFICATION}
        />
      </head>
      <body>
        <RecoilRootProvider>
          <NextAuthSessionProvider>
            <ReactQueryClientProvider>
              <DarkModeContainer>
                <Header font={OpenSans} />
                <main
                  className={clsx(
                    "min-h-screen bg-white",
                    "xs:my-10 py-12 xs:pt-4 xs:pb-12 xs:px-4 lg:px-12 2xl:px-24 desktop:px-48",
                    "dark:bg-black dark:text-warmGray-50 dark:[&__input]:text-gray-700 dark:[&__textarea]:text-gray-700",
                  )}
                >
                  <ReactQueryErrorBoundary isLayout={true}>
                    {children}
                  </ReactQueryErrorBoundary>
                </main>
                <Footer />
              </DarkModeContainer>
              <AuthUserNavigator />
              <CommonModalProvider />
            </ReactQueryClientProvider>
          </NextAuthSessionProvider>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
