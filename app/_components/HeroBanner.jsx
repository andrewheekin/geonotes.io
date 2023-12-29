'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const FADE_DURATION = 200;

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if the banner has been closed in the past and how many times
    const bannerCloseCount = parseInt(Cookies.get('heroBannerCloseCount') || '0');
    if (bannerCloseCount < 2) {
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
      const bannerCloseCount = parseInt(Cookies.get('heroBannerCloseCount') || '0');
      Cookies.set('heroBannerCloseCount', bannerCloseCount + 1, { expires: 14 });
    }, FADE_DURATION); // Set this to the duration of the fade-out
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  // Conditional classes for fade-out effect
  const bannerClasses = `relative w-full pt-8 pb-14 my-4 md:mb-10 bg-[rgba(0,0,0,0.1)] rounded-md transition-opacity duration-${FADE_DURATION} ${
    isFadingOut ? 'opacity-0' : 'opacity-100'
  }`;

  return (
    <div className={bannerClasses}>
      <button
        onClick={handleClose}
        className="absolute -top-2 -right-2 text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.5)]"
      >
        <HighlightOffIcon className="bg-white rounded-2xl" />
      </button>
      <div className="hidden sm:mb-6 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Learn locations around the world with GeoNotes.{' '}
          <Link href="/account" className="font-semibold text-cyan-600">
            <span className="absolute inset-0" aria-hidden="true" />
            Learn now <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold tracking-tight text-gray-900">Learn the world with GeoNotes</div>
        <p className="mt-4 max-w-xl mx-auto text-md leading-8 text-gray-600">
          Share information about the world around you. GeoNotes is a community-driven platform for sharing knowledge.
        </p>
      </div>
    </div>
  );
}
