import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Main } from "../components/layout/Main";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/dark.js" type="text/javascript" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  );
}
