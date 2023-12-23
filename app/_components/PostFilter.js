'use client';

import React, { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SettingsIcon from '@mui/icons-material/Settings'; // or NewReleasesIcon if you prefer
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function PostFilter() {
  const [displayType, setDisplayType] = useState('list');
  const [postSortType, setPostSortType] = useState('hot');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChangeDisplayType = (type) => {
    setDisplayType(type);

    // Update the URL params with the new displayType
    const params = new URLSearchParams(searchParams);
    params.set('displayType', type);
    const newParams = `${pathname}?${params.toString()}`;
    replace(newParams);
  };

  const handleChangePostSortType = (type) => {
    setPostSortType(type);

    // Update the URL params with the new postSortType
    const params = new URLSearchParams(searchParams);
    params.set('postSortType', type);
    const newParams = `${pathname}?${params.toString()}`;
    replace(newParams);
  };

  const buttonBaseClass = 'text-black text-sm font-bold py-1 px-2 rounded-xl';

  return (
    <div className="flex justify-between items-center my-4 p-2 w-full rounded-lg bg-gray-200">
      {/* Sorting Options */}
      <div className="flex gap-2">
        <button
          className={`${buttonBaseClass} ${
            postSortType === 'hot' ? 'bg-gray-300' : 'bg-transparent hover:text-gray-500'
          }`}
          onClick={() => handleChangePostSortType('hot')}
        >
          <WhatshotIcon className="mr-2" /> Hot
        </button>
        <button
          className={`${buttonBaseClass} ${
            postSortType === 'new' ? 'bg-gray-300' : 'bg-transparent hover:text-gray-500'
          }`}
          onClick={() => handleChangePostSortType('new')}
        >
          <SettingsIcon className="mr-2" /> New
        </button>
        <button
          className={`${buttonBaseClass} ${
            postSortType === 'top' ? 'bg-gray-300' : 'bg-transparent hover:text-gray-500'
          }`}
          onClick={() => handleChangePostSortType('top')}
        >
          <TrendingUpIcon className="mr-2" /> Top
        </button>
      </div>

      {/* Display Options */}
      <div>
        <button
          className={`p-2 rounded ${displayType === 'list' ? 'bg-gray-300' : 'bg-transparent'}`}
          onClick={() => handleChangeDisplayType('list')}
        >
          <ViewListIcon />
        </button>
        <button
          className={`p-2 rounded ${displayType === 'grid' ? 'bg-gray-300' : 'bg-transparent'}`}
          onClick={() => handleChangeDisplayType('grid')}
        >
          <ViewModuleIcon />
        </button>
      </div>
    </div>
  );
}
