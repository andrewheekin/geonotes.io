import { Open_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { getUserSession } from './_lib/server-data';
import { ThemeProvider } from 'next-themes'
import Footer from './_components/Footer';
import Navbar from './_components/Navbar';
import Gradient from './_components/Gradient';
import GeoNotesToaster from './_lib/toasts';
import './globals.css';

const open_sans = Open_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'GeoNotes',
  description: 'Learn the world',
  icons: [{ url: '/favicon.ico', href: '/favicon.ico' }],
};

export default async function RootLayout({ children }) {
  const userSession = await getUserSession();
  const user = userSession?.user;

  return (
    <html lang="en">
      <body className={open_sans.className}>
      <ThemeProvider>
          <Gradient />
          <Navbar user={user} />
          <main className="flex flex-col items-center min-h-screen p-2 md:p-4">
          <GeoNotesToaster font={open_sans} />
          {children}
        </main>
        <Footer />
        <Analytics />
      </ThemeProvider>
      </body>
    </html>
  );
}
