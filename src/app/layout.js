import { Alert, ThemeProvider } from '@mui/material';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { baselightTheme } from '@/components/themes/Theme';
import { SelectedItemProvider } from '@/context/NavItemContext';
import { LoadingProvider, useIsLoading } from '@/context/LoadingContext';
import { Suspense } from 'react';
import Spinner from '@/components/spinner/Spinner';
import Loading from '@/components/spinner/Loading';
import { AlertProvider } from '@/context/AlertContext';
import { AuthProvider } from '@/context/AuthContext';
import { MdaProvider } from '@/context/MdaContext';
import { RetireeIdProvider } from '@/context/RetireeContext';
import { SearchContext, SearchContextProvider } from '@/context/SearchContext';
import { StatusProvider } from '@/context/StatusContext';

export const metadata = {
  title: 'PMIS',
  description: '',
};

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <AuthProvider>
            <MdaProvider>
              <StatusProvider>
                <RetireeIdProvider>
                  <SelectedItemProvider>
                    <ThemeProvider theme={baselightTheme}>
                      <SearchContextProvider>
                        <AlertProvider>{children}</AlertProvider>
                      </SearchContextProvider>
                    </ThemeProvider>
                  </SelectedItemProvider>
                </RetireeIdProvider>
              </StatusProvider>
            </MdaProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
