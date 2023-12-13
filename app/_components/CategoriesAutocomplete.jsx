'use client';

import React from 'react';
import { Autocomplete, Box, TextField, Chip, Typography } from '@mui/material';
import CategoriesList from '../_lib/CategoriesList';

export default function CategoriesAutocomplete({ setSelectedCategories }) {
  return (
    <>
      <Autocomplete
        multiple
        options={CategoriesList}
        onChange={(event, newValue) => setSelectedCategories(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={<Typography style={{ fontSize: '0.9rem' }}>Categories (ex, Bollards)</Typography>}
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
                label={<Typography style={{ fontSize: '0.9rem' }}>{option}</Typography>}
                {...tagPropsNoKey}
              />
            );
          })
        }
        renderOption={(props, option) => {
          const { key, ...propsNoKey } = { ...props };
          return (
            <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...propsNoKey}>
              {option}
            </Box>
          );
        }}
      />
      <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.7rem', color: 'grey', margin: '0' }}>
        matches ALL
      </Typography>
    </>
  );
}
