'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const isBannerClosed = Cookies.get('heroBannerClosed');
    setIsVisible(!isBannerClosed);
    setIsInitialized(true);
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      Cookies.set('heroBannerClosed', 'true', { expires: 14 });
    }, 100); // Set this to the duration of the fade-out
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  return (
    <div className="relative w-full py-20 my-4 md:mb-10 bg-[rgba(0,0,0,0.1)] rounded-md">
      <button
        onClick={handleClose}
        className="absolute -top-2 -right-2 text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.5)] font-bold"
      >
        <HighlightOffIcon className="bg-white rounded-2xl" />
      </button>
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Chat with your document.{' '}
          <Link href="/ai" className="font-semibold text-emerald-500">
            <span className="absolute inset-0" aria-hidden="true" />
            Try now <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          The Open-Source DocSend Alternative
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg leading-8 text-gray-600">
          Share pitch decks, sales proposals and other docs securely with real-time analytics and white-labeling
          options.
        </p>
      </div>
    </div>
  );
}
