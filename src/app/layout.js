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
import { AuthProvider } from "@/context/AuthContext";

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
      <body>
        <LoadingProvider>
          <AuthProvider>
            <SelectedItemProvider>
              <ThemeProvider theme={baselightTheme}>
                <AlertProvider>
                  <Suspense fallback={<Spinner />}> {children}</Suspense>
                </AlertProvider>
              </ThemeProvider>
            </SelectedItemProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
