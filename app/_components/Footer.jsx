import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import GitHubIcon from '@mui/icons-material/GitHub'; // Import GitHubIcon

export default function Footer() {
  return (
    <footer className="shadow-none container mx-auto flex flex-wrap flex-col md:flex-row items-center justify-between px-4 py-6 md:py-12">
      <div className="flex items-center pt-4 md:pt-0">
        <Image src="/globe.png" alt="Globe" width={20} height={20} unoptimized className="mr-2" />
        <Link href="/" className="text-lg text-black dark:text-white font-bold tracking-tighter">
          GeoNotes
        </Link>
      </div>
      <span className="text-black dark:text-white text-sm font-medium pb-4 md:pb-0">©2023 GeoNotes. All rights reserved.</span>

      <div className="flex items-center space-x-12">
        <Link
          href="https://github.com/andrewheekin/geonotes.io"
          className="flex text-black dark:text-white text-md font-medium hover:text-gray-500 dark:hover:text-gray-400"
        >
          <GitHubIcon />
          <div className="ml-1">GitHub</div>
        </Link>
        <Link href="/privacy-policy" className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 font-medium">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
