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
          <Toaster
            closeButton
            richColors
            theme={'system'}
            position="top-center"
            duration={1500}
            toastOptions={{
              classNames: {
                title: `${open_sans.className} text-lg tracking-tighter font-bold pt-2 px-4`,
                description: `${open_sans.className} text-md tracking-tight font-semibold py-2 px-4`,
                // toast?: string;
                // loader?: string;
                // closeButton?: string;
                // cancelButton?: string;
                // actionButton?: string;
                // success?: string;
                // error?: string;
                // info?: string;
                // warning?: string;
              },
            }}
            // style: { fontSize: '1rem', padding: '20px', opacity: '0.9' }
            // toastOptions={{
            //   unstyled: true,
            //   classNames: {
            //     toast: 'bg-blue-400',
            //     title: 'text-red-400',
            //     description: 'text-red-400',
            //     actionButton: 'bg-zinc-400',
            //     cancelButton: 'bg-orange-400',
            //     closeButton: 'bg-lime-400',
            //   },
            // }}
          />
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
