import DarkModeListener from "../components/client/DarkModeListener";
import { Footer } from "../components/layout/Footer";
import { Main } from "../components/layout/Main";
import { getThemedGradients } from "../lib/colors";
import { colorValidator } from "../lib/validation";
import "./globals.css";

const BG_THEMES = {
  light: [
    "oklch(95% 0.024 16)",
    "oklch(95% 0.024 160)",
    "oklch(95% 0.024 305)",
  ].map((c) => colorValidator.parse(c)),
  dark: [
    "oklch(20% 0.033 16)",
    "oklch(20% 0.033 160)",
    "oklch(20% 0.033 305)",
  ].map((c) => colorValidator.parse(c)),
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
