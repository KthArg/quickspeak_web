// src/app/layout.tsx
import { ThemeProvider } from './contexts/ThemeContext';
import './globals.css';
// ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {/* ThemeScript ya no está aquí */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}