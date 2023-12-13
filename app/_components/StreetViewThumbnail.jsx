// I think I can make this a server component... actually no bc it is a child of a client component
// "use client";

import React from 'react';

function StreetViewThumbnail({ lat, lng, width, height, heading, pitch, zoom }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_STREETVIEW_API_KEY;

  const imgUrl = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${zoom}&key=${apiKey}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${zoom}`;

  return (
    <a href={streetViewUrl} target="_blank" rel="noopener noreferrer">
      <img src={imgUrl} alt="Street View Thumbnail" />
    </a>
  );
}

export default StreetViewThumbnail;
