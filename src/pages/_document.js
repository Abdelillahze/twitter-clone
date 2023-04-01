import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div
          id="portal"
          className="hidden fixed z-20 top-0 left-0 w-full h-[100vh]"
        />
        <NextScript />
      </body>
    </Html>
  );
}
