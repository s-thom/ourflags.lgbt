import DarkModeListener from "../components/client/DarkModeListener";
import { Footer } from "../components/layout/Footer";
import { Main } from "../components/layout/Main";
import { getThemedGradients } from "../lib/colors";
import "./globals.css";

const BG_THEMES = {
  light: ["#fde8ee", "#eaf2e1", "#f1ebfc"],
  dark: ["#241117", "#141b0a", "#1a1424"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const style = getThemedGradients(BG_THEMES);

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
      <body
        className={`min-h-screen flex flex-col text-black dark:text-white bg-gradient-to-br gradient-light dark:gradient-dark font-body`}
        style={style}
      >
        <Main>{children}</Main>
        <Footer />
        <DarkModeListener />
      </body>
    </html>
  );
}
