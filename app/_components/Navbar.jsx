'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { toast } from 'sonner';
import { motion } from 'framer-motion'; // Import motion
import { IS_MOBILE } from '../_lib/helpers';

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    if (IS_MOBILE()) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-transparent shadow-none container mx-auto flex flex-wrap items-center justify-between px-4 py-2">
      <div className="flex items-end">
        <Image src="globe.png" alt="Globe" width={30} height={30} unoptimized className="mr-2" />
        <Link href="/" className="flex flex-col">
          <div className="text-2xl text-black font-bold tracking-tighter">GeoNotes</div>
        </Link>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="black"
          >
            <path d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <motion.div
        className={`w-full md:flex md:items-center md:w-auto md:opacity-100 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        animate={isOpen ? 'open' : 'closed'}
        // Note, these variants styles are applied to desktop as well - this can cause issues with desktop styles
        variants={{
          open: { height: 'auto', transition: { duration: 0.3, type: 'spring' } },
          closed: { height: 0, transition: { duration: 0.2 } },
        }}
        initial="closed"
      >
        <ul className="pt-4 md:flex md:justify-between md:pt-0">
          <li>
            <Link
              href="https://github.com/andrewheekin/geonotes.io"
              className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black hover:text-gray-500 font-semibold tracking-tight"
              onClick={handleLinkClick}
            >
              <GitHubIcon />
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black hover:text-gray-500 font-semibold tracking-tight px-2"
              onClick={handleLinkClick}
            >
              About
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  href="/submit"
                  className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black hover:text-gray-500 font-semibold tracking-tight px-2"
                  onClick={handleLinkClick}
                >
                  Add GeoNote
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="block mt-4 md:inline-block md:mt-0 md:ml-4  px-2"
                  onClick={handleLinkClick}
                >
                  <div className="text-black hover:text-gray-500 font-semibold tracking-tight">Account</div>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <div
                  onClick={() => {
                    toast('Login to add GeoNotes!');
                    handleLinkClick();
                  }}
                  className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black hover:text-gray-500 font-semibold tracking-tight px-2 cursor-pointer"
                >
                  Add GeoNote
                </div>
              </li>
              <li>
                <Link
                  href="/login"
                  className="block mt-4 md:inline-block md:mt-0 md:ml-4  px-2"
                  onClick={handleLinkClick}
                >
                  <div className="text-black hover:text-gray-500 font-semibold tracking-tight">Login</div>
                </Link>
              </li>
            </>
          )}
        </ul>
      </motion.div>
    </nav>
  );
}
