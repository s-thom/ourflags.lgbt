import { getThemedGradients } from "../lib/colors";
import DarkModeListener from "../lib/components/client/DarkModeListener";
import { Footer } from "../lib/components/layout/Footer";
import { Main } from "../lib/components/layout/Main";
import { colorValidator } from "../lib/server/validation";
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
        className={`gradient-light dark:gradient-dark flex min-h-screen flex-col bg-gradient-to-br font-body text-black dark:text-white`}
        style={style}
      >
        <Main>{children}</Main>
        <Footer />
        <DarkModeListener />
      </body>
    </html>
  );
}
