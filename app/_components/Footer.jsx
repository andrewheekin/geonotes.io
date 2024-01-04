import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import GitHubIcon from '@mui/icons-material/GitHub'; // Import GitHubIcon

export default function Footer() {
  return (
    <footer className="shadow-none container mx-auto flex flex-wrap items-center justify-between px-4 py-6 md:py-12">
      <div className="flex items-center pt-4 md:pt-0">
        <Image src="/globe.png" alt="Globe" width={20} height={20} unoptimized className="mr-2" />
        <Link href="/" className="text-lg text-black font-bold tracking-tighter">
          GeoNotes
        </Link>
      </div>
      <span className="text-black text-sm font-mono font-medium pb-4 md:pb-0">©2023 GeoNotes. All rights reserved.</span>

      <div className="flex items-center space-x-12">
        <Link
          href="https://github.com/andrewheekin/geonotes.io"
          className="flex text-black text-md font-mono font-medium hover:text-gray-500"
        >
          <GitHubIcon />
          <div className="ml-1">GitHub</div>
        </Link>
        <Link href="/privacy-policy" className="text-black hover:text-gray-500 font-mono font-medium">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
