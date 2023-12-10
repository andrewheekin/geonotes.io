// src/app/CountriesAutocomplete.jsx
"use client";

import React from "react";
import { Autocomplete, Box, TextField, Chip, Typography } from "@mui/material";
import CountriesList from "./CountriesList";

export default function CountriesAutocomplete({ setSelectedCountries }) {
  return (
    <>
      <Autocomplete
        multiple
        style={{ fontFamily: "monospace" }}
        fontFamily="monospace"
        options={CountriesList}
        getOptionLabel={(option) => option.label}
        onChange={(event, newValue) => {
          // 'newValue' is the full current selection of options,
          // so you can map it to an array of country values directly.
          setSelectedCountries(newValue.map((option) => option.value));
        }}
        renderOption={(props, option) => {
          const { key, ...propsNoKey } = { ...props };
          return (
            <Box key={key} component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 }, fontFamily: 'monospace' }} {...propsNoKey}>
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={<Typography style={{ fontFamily: "monospace", fontSize: '0.9rem' }}>Choose countries</Typography>} fullWidth />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            // Get the tag props excluding the key prop
            const { key, ...tagPropsNoKey } = { ...getTagProps({ index }) };
            return <Chip key={index} label={<Typography style={{ fontFamily: "monospace", fontSize: '0.9rem' }}>{option.label}</Typography>} {...tagPropsNoKey} />;
          })
        }
      />
      <Typography
        variant="body2"
        color="text.secondary"
        style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "grey", margin: "0" }}
      >
        <sup>*</sup>matches ANY country if multiple
      </Typography>
    </>
  );
}
