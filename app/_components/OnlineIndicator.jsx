'use client';

import React, { useState, useEffect } from 'react';

export default function OnlineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Update isOnline state based on actual navigator status when component mounts
    setIsOnline(navigator.onLine);

    // Event listeners to track online/offline status
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    // Cleanup function to remove the event listeners
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  // Render "No internet" message when offline
  if (!isOnline) {
    return (
      <div className="max-w-5xl flex justify-center items-center my-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-xl text-black dark:text-white font-semibold tracking-tighter">⚠️</p>
        <p className="text-xl text-black dark:text-white font-semibold tracking-tighter">To use GeoNotes, please connect to the internet</p>
      </div>
    );
  }

  return null;
}
