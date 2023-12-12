// src/app/CategoriesAutocomplete.jsx
'use client';

import React from 'react';
import { Autocomplete, Box, TextField, Chip, Typography } from '@mui/material';
import CategoriesList from './CategoriesList';

export default function CategoriesAutocomplete({ setSelectedCategories }) {
  return (
    <>
      <Autocomplete
        multiple
        style={{ fontFamily: 'monospace' }}
        fontFamily="monospace"
        options={CategoriesList}
        onChange={(event, newValue) => setSelectedCategories(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={
              <Typography style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>Categories (ex, Bollards)</Typography>
            }
            fullWidth
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            // Get the tag props excluding the key prop
            const { key, ...tagPropsNoKey } = { ...getTagProps({ index }) };
            return (
              <Chip
                key={index}
                label={<Typography style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{option}</Typography>}
                {...tagPropsNoKey}
              />
            );
          })
        }
        renderOption={(props, option) => {
          const { key, ...propsNoKey } = { ...props };
          return (
            <Box
              key={key}
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 }, fontFamily: 'monospace' }}
              {...propsNoKey}
            >
              {option}
            </Box>
          );
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'grey', margin: '0' }}
      >
        matches ALL
      </Typography>
    </>
  );
}
