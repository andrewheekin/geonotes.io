'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const FADE_DURATION = 200;
// Number of times the banner can be closed before it is hidden forever
const HERO_BANNER_CLOSE_COUNT = 1;
// Version of the banner, used to set the cookie name
const HERO_BANNER_VERSION = 1;
// Cookie name is based on the version of the banner
const HERO_BANNER_COOKIE_NAME = `heroBannerCloseCount_v${HERO_BANNER_VERSION}`;

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if the banner has been closed in the past and how many times
    const bannerCloseCount = parseInt(Cookies.get(HERO_BANNER_COOKIE_NAME) || '0');
    if (bannerCloseCount < HERO_BANNER_CLOSE_COUNT) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setIsInitialized(true);
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      // Increment the banner close count
      const bannerCloseCount = parseInt(Cookies.get(HERO_BANNER_COOKIE_NAME) || '0');
      Cookies.set(HERO_BANNER_COOKIE_NAME, bannerCloseCount + 1, { expires: 365 });
    }, FADE_DURATION); // Set this to the duration of the fade-out
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  // Conditional classes for fade-out effect
  const bannerClasses = `relative w-full pt-4 pb-8 my-4 md:mb-10 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] rounded-md transition-opacity duration-${FADE_DURATION} ${
    isFadingOut ? 'opacity-0' : 'opacity-100'
  }`;

  return (
    <div className={bannerClasses}>
      <button
        onClick={handleClose}
        className="absolute -top-2 -right-2 text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.7)] dark:hover:text-[rgba(255,255,255,0.5)]"
      >
        <HighlightOffIcon className="bg-white dark:bg-black rounded-2xl" />
      </button>
      <div className="hidden sm:mb-6 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 font-mono text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-300/10 hover:ring-gray-900/20 dark:hover:ring-gray-300/20">
          Learn locations around the world with GeoNotes.{' '}
          <Link href="/account" className="font-semibold text-cyan-600 dark:text-cyan-300">
            <span className="absolute inset-0" aria-hidden="true" />
            Learn now <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-mono font-bold tracking-tight text-gray-900 dark:text-white">Welcome to GeoNotes</div>
        <p className="mt-4 max-w-xl mx-auto font-mono text-md leading-8 text-gray-600 dark:text-gray-300">
          GeoNotes.io is the open source platform for community-contributed Street View notes
        </p>
      </div>
    </div>
  );
}
