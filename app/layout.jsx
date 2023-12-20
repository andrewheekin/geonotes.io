import { Open_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { getUserSession } from './_lib/server-data';
import Navbar from './_components/Navbar';
import Gradient from './_components/Gradient';
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
        <Gradient />
        <Navbar user={user} />
        <main className="flex flex-col items-center min-h-screen p-2 md:p-4">
          <Toaster closeButton richColors theme={'system'} position='top-center' />
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
