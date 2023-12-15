import { Open_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
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
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <Navbar userId={''} />
        <main
          className="d-flex mh-100vh min-h-screen flex-column align-items-start py-4"
          // min-h-screen is minimum height of the viewport
          // py-4 is padding on the top and bottom
          // align-items-start is aligning the content to the top
        >
          <Gradient />

          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
