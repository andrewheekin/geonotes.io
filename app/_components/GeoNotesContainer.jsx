'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Container, Card, Chip, CardContent, CircularProgress } from '@mui/material';
import { getCountryCode } from '../_lib/CountriesList';
import StreetViewThumbnail from './StreetViewThumbnail';
import CountriesAutocomplete from './CountriesAutocomplete';
import CategoriesAutocomplete from './CategoriesAutocomplete';
import RegionSpecificToggle from './RegionSpecificToggle';

export default function GeoNotesContainer({ geoNotes }) {
  const [filteredGeoNotes, setFilteredGeoNotes] = useState(geoNotes);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showRegionSpecific, setShowRegionSpecific] = useState(true);

  useEffect(() => {
    const filteredNotes =
      geoNotes &&
      geoNotes.filter(
        (note) =>
          (selectedCategories.length === 0 ||
            selectedCategories.every((category) => note.categories.includes(category))) &&
          (selectedCountries.length === 0 || selectedCountries.includes(note.country)) &&
          (showRegionSpecific ? true : !(note.region && note.region.length > 0))
      );
    setFilteredGeoNotes(filteredNotes);
  }, [selectedCategories, selectedCountries, showRegionSpecific, geoNotes]);

  if (geoNotes && geoNotes.length == 0) {
    return (
      <Container
        style={{ maxWidth: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress /> {/* Loading Spinner */}
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: '900px' }}>
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
      {filteredGeoNotes && filteredGeoNotes.length > 0 ? (
        filteredGeoNotes.map((note, index) => (
          <Card
            key={index}
            style={{
              marginBottom: '1rem',
              border: '3px solid black',
              backgroundColor: 'lightgray',
              position: 'relative',
            }}
          >
            {note.region && note.region.length > 0 && (
              <Chip
                label={
                  <Typography style={{ fontFamily: 'monospace', fontSize: '0.7rem', margin: 0, padding: '1px' }}>
                    REGIONAL
                  </Typography>
                }
                sx={{
                  position: 'absolute',
                  top: 8, // Adjust as needed
                  right: 8, // Adjust as needed
                  zIndex: 1, // To ensure it stays on top
                  borderRadius: 0,
                  padding: 0,
                  lineHeight: 1,
                }}
              />
            )}
            <CardContent style={{ padding: '1rem' }}>
              <Typography variant="h5" component="div" style={{ fontFamily: 'monospace', color: 'black' }}>
                {note.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ fontFamily: 'monospace', color: 'black' }}>
                {note.description}
              </Typography>
              <div style={{ marginTop: '10px' }}>
                {/* Country chip */}
                <Chip
                  label={note.country}
                  style={{ marginRight: '5px', marginBottom: '5px', fontFamily: 'monospace' }}
                  avatar={
                    <Avatar
                      alt=""
                      // variant='square'
                      src={`https://flagcdn.com/w80/${getCountryCode(note.country).toLowerCase()}.png`}
                    />
                  }
                />
                {/* Regions chip */}
                {note.region &&
                  note.region.length > 0 &&
                  note.region.map((reg, index) => (
                    <Chip
                      key={index}
                      label={reg}
                      style={{
                        marginRight: '5px',
                        marginBottom: '5px',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgb(214, 246, 214)',
                      }}
                    />
                  ))}
                {note.categories &&
                  note.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      style={{ marginRight: '5px', marginBottom: '5px', fontFamily: 'monospace' }}
                    />
                  ))}
                {note.author && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'grey', margin: '0 0 5px 0' }}
                  >
                    added by {note.author}
                  </Typography>
                )}
              </div>
              <StreetViewThumbnail
                lat={note.lat}
                lng={note.lng}
                width={2000} // 1.82 ratio of w:h
                height={1100}
                heading={note.heading}
                pitch={note.pitch}
                zoom={note.zoom}
              />
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography
          variant="h6"
          component="div"
          style={{ fontFamily: 'monospace', color: 'black', textAlign: 'center', marginTop: '2rem' }}
        >
          No GeoNotes yet for this search :(
        </Typography>
      )}
    </Container>
  );
}
