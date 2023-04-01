import Sidebar from "@/components/Sidebar";
import News from "@/components/News";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  if (Component.getLayout) {
    return (
      <SessionProvider session={session}>
        {Component.getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    );
  }

  return (
    <div className="flex min-h-[100vh] bg-black-100 text-white-100">
      <SessionProvider session={session}>
        {pageProps.user && <Sidebar user={pageProps.user} />}
        <Component {...pageProps} />
        {pageProps.user && <News user={pageProps.user} />}
      </SessionProvider>
    </div>
  );
}
