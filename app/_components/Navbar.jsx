'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navbar({ userId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-transparent shadow-none container mx-auto flex flex-wrap items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <Image
          src="https://media.tenor.com/dhfraztxBo8AAAAj/globe-joypixels.gif"
          alt="Globe"
          width={40}
          height={40}
          unoptimized
          className="mr-2"
        />
        <Link href="/" className="text-black text-lg font-semibold flex flex-col leading-tight">
          {/* TODO make this font bigger, tailwind not behaving */}
          GeoNotes
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
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
        <ul className='pt-4 md:flex md:justify-between md:pt-0"'>
          <li>
            <Link
              href="https://github.com/andrewheekin/geonotes.io"
              className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black hover:text-gray-500"
            >
              <GitHubIcon />
            </Link>
          </li>
          <li>
            <Link href="/about" className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black px-2">
              About
            </Link>
          </li>
          <li>
            <Link href="/submit" className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black px-2">
              Add GeoNote
            </Link>
          </li>
          <li>
            {userId && <div className="block mt-4 md:inline-block md:mt-0 md:ml-4 text-black px-2">{userId}</div>}
          </li>
        </ul>
      </div>
    </nav>
  );
}
