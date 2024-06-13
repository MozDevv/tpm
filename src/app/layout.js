import { Alert, ThemeProvider } from "@mui/material";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { baselightTheme } from "@/components/themes/Theme";
import { SelectedItemProvider } from "@/context/NavItemContext";
import { LoadingProvider, useIsLoading } from "@/context/LoadingContext";
import { Suspense } from "react";
import Spinner from "@/components/spinner/Spinner";
import Loading from "@/components/spinner/Loading";
import { AlertProvider } from "@/context/AlertContext";

export const metadata = {
  title: "TPMIS",
  description: "",
};

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SelectedItemProvider>
        <LoadingProvider>
          <ThemeProvider theme={baselightTheme}>
            <AlertProvider>
              <body>
                <Suspense fallback={<Spinner />}>{children}</Suspense>
              </body>
            </AlertProvider>
          </ThemeProvider>
        </LoadingProvider>
      </SelectedItemProvider>
    </html>
  );
}
