import type { Metadata } from 'next';
import { ThemeProvider } from './contexts/ThemeContext';
import { Inter } from 'next/font/google';
import './globals.css';
import NotificationToast from './components/NotificationToast';
import ErrorBoundary from './components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickSpeak',
  description: 'AI-Powered Language Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            {children}
            <NotificationToast position="top-right" />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}