'use client';

import React, { useState, useEffect } from 'react';
import CountriesAutocomplete from './CountriesAutocomplete';
import CategoriesAutocomplete from './CategoriesAutocomplete';
import RegionSpecificToggle from './RegionSpecificToggle';
import GeoNoteSearch from './GeoNoteSearch';

export default function GeoNotesContainer() {
  const [filteredGeoNotes, setFilteredGeoNotes] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showRegionSpecific, setShowRegionSpecific] = useState(true);
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
      <div className="max-w-5xl w-full flex justify-center items-center my-8">
        <p className="text-xl text-black font-semibold tracking-tighter">Please connect to the internet</p>
      </div>
    );
  }

  // useEffect(() => {
  //   const filteredNotes = [];
  //     // geoNotes &&
  //     // geoNotes.filter(
  //     //   (note) =>
  //     //     (selectedCategories.length === 0 ||
  //     //       selectedCategories.every((category) => note.categories.includes(category))) &&
  //     //     (selectedCountries.length === 0 || selectedCountries.includes(note.country)) &&
  //     //     (showRegionSpecific ? true : !(note.region && note.region.length > 0))
  //     // );
  //   setFilteredGeoNotes(filteredNotes);
  // }, [selectedCategories, selectedCountries, showRegionSpecific]);

  // if (filteredGeoNotes && filteredGeoNotes.length == 0) {
  //   return (
  //     <Container
  //       style={{ maxWidth: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
  //     >
  //       <CircularProgress /> {/* Loading Spinner */}
  //     </Container>
  //   );
  // }

  return (
    <div className="max-w-5xl w-full">
      {/* <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-grow w-full">
          <CountriesAutocomplete setSelectedCountries={setSelectedCountries} />
        </div>
        <div className="flex-grow w-full">
          <CategoriesAutocomplete setSelectedCategories={setSelectedCategories} />
        </div>
      </div> */}
      <div className="flex flex-row mb-4 mt-2 w-full">
        <GeoNoteSearch />
      </div>
      <div className="flex flex-row mb-4 mt-2">
        {/* <RegionSpecificToggle setShowRegionSpecific={setShowRegionSpecific} /> */}
      </div>
    </div>
  );
}
