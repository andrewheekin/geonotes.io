'use client';

import { useState, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Cookies from 'js-cookie';

const FADE_DURATION = 200;

export default function ContributorBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const isContributionBanner = Cookies.get('contributionBannerClosed');
    setIsVisible(!isContributionBanner);
    setIsInitialized(true);
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      Cookies.set('contributionBannerClosed', 'true', { expires: 14 });
    }, FADE_DURATION); // Set this to the duration of the fade-out
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  return (
    <div
      className={`relative mb-4 mx-auto p-2 bg-[rgba(0,0,0,0.1)] text-center rounded-lg transition-opacity duration-${FADE_DURATION} ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <button
        onClick={handleClose}
        className="absolute -top-2 -right-2 text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.5)]"
      >
        <HighlightOffIcon className="bg-white rounded-2xl" />
      </button>
      <p className="text-black text-md font-normal">
        GeoNotes.io is looking for open source contributors 💻 If you are interested in helping build the site, visit
        our{' '}
        <a href="https://github.com/andrewheekin/geonotes.io/issues" className="text-cyan-600 underline">
          GitHub
        </a>
      </p>
    </div>
  );
}
