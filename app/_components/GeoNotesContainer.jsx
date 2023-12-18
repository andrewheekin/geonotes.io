'use client';

import React, { useState, useEffect } from 'react';
import { Container, CircularProgress } from '@mui/material';
import CountriesAutocomplete from './CountriesAutocomplete';
import CategoriesAutocomplete from './CategoriesAutocomplete';
import RegionSpecificToggle from './RegionSpecificToggle';

export default function GeoNotesContainer() {
  const [filteredGeoNotes, setFilteredGeoNotes] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showRegionSpecific, setShowRegionSpecific] = useState(true);

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
    <div className="mx-auto max-w-[900px]">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-grow w-full">
          <CountriesAutocomplete setSelectedCountries={setSelectedCountries} />
        </div>
        <div className="flex-grow w-full">
          <CategoriesAutocomplete setSelectedCategories={setSelectedCategories} />
        </div>
      </div>
      <div className="flex flex-row mb-4 mt-2">
        <RegionSpecificToggle setShowRegionSpecific={setShowRegionSpecific} />
      </div>
    </div>
  );
}
