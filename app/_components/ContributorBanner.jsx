'use client';

import { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Cookies from 'js-cookie';

export default function ContributorBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const isBannerClosed = Cookies.get('bannerClosed');
    setIsVisible(!isBannerClosed);
    setIsInitialized(true);
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      Cookies.set('bannerClosed', 'true', { expires: 14 });
    }, 100); // Set this to the duration of the fade-out
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  return (
    <div
      className={`relative m-4 p-2 bg-green-300 rounded-lg transition-opacity duration-100 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <button
        onClick={handleClose}
        className="absolute -top-2 -right-2 text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.5)] font-bold"
      >
        <HighlightOffIcon className="bg-gray-100 rounded-2xl" />
      </button>
      <p className="text-black text-md tracking-tighter font-semibold">
        GeoNotes.io is looking for open source contributors 💻 If you are interested in helping build the site, visit
        our{' '}
        <a href="https://github.com/andrewheekin/geonotes.io/issues" className="text-blue-800 underline">
          GitHub
        </a>
      </p>
    </div>
  );
}
