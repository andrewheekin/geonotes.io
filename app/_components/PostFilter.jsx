'use client';

import {useEffect, useState} from 'react';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SettingsIcon from '@mui/icons-material/Settings'; // or NewReleasesIcon if you prefer
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {loginToFilterGeoNotes} from '../_lib/toasts';
import {IS_MOBILE} from '../_lib/helpers';

export default function PostFilter() {
    const supabase = createClientComponentClient();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [displayType, setDisplayType] = useState('');
    const [postSortType, setPostSortType] = useState('');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    // async useEffect that checks if user is authenticated within a try catch block
    // Initialize the displayType and postSortType from the URL params (or fallback to defaults)
    useEffect(() => {
        const checkIfAuthenticated = async () => {
            try {
                const {
                    data: {user},
                } = await supabase.auth.getUser();
                if (user) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkIfAuthenticated();

        const params = new URLSearchParams(searchParams);
        const displayTypeParam = params.get('displayType');
        const postSortTypeParam = params.get('postSortType');

        // If user is unauthenticated: set Desktop default to grid view, set Mobile default to list view
        if (!isAuthenticated) {
            if (IS_MOBILE()) {
                setDisplayType('list');
                params.set('displayType', 'list');
            } else {
                setDisplayType('grid');
                params.set('displayType', 'grid');
            }
        } else {
            // User is authenticated, set the displayType and postSortType from the URL params, or fallback to defaults (list and hot)
            if (displayTypeParam) {
                setDisplayType(displayTypeParam);
            } else {
                setDisplayType('list');
                params.set('displayType', 'list');
            }

            if (postSortTypeParam) {
                setPostSortType(postSortTypeParam);
            } else {
                setPostSortType('hot');
            }
        }

        replace(`${pathname}?${params.toString()}`);
    }, []);

    const handleChangeDisplayType = (type) => {
        // If user is unauthenticated, DO STILL allow them to change the displayType
        setDisplayType(type);

        // Update the URL params with the new displayType
        const params = new URLSearchParams(searchParams);
        params.set('displayType', type);
        const newParams = `${pathname}?${params.toString()}`;
        replace(newParams);
    };

    const handleChangePostSortType = (type) => {
        // If user is unauthenticated, don't allow them to change the postSortType and show the login toast
        if (!isAuthenticated) {
            loginToFilterGeoNotes();
            return;
        }

        setPostSortType(type);

        // Update the URL params with the new postSortType
        const params = new URLSearchParams(searchParams);
        params.set('postSortType', type);
        const newParams = `${pathname}?${params.toString()}`;
        replace(newParams);
    };

    const buttonBaseClass = 'text-black dark:text-white text-sm font-mono font-bold py-1 px-2 rounded-xl active:bg-gray-300 dark:active:bg-gray-800';

    return (
        <div className="flex justify-between items-center my-4 p-2 w-full rounded-lg bg-gray-200 dark:bg-gray-700">
            {/* Sorting Options */}
            <div className="flex gap-2">
                <button
                    className={`${buttonBaseClass} ${
                        postSortType === 'hot' ? 'bg-gray-300 dark:bg-gray-800' : 'bg-transparent hover:text-gray-500 dark:hover:text-gray-400'
                    }`}
                    onClick={() => handleChangePostSortType('hot')}
                >
                    <WhatshotIcon className="mr-2"/> Hot
                </button>
                <button
                    className={`${buttonBaseClass} ${
                        postSortType === 'new' ? 'bg-gray-300 dark:bg-gray-800' : 'bg-transparent hover:text-gray-500 dark:hover:text-gray-400'
                    }`}
                    onClick={() => handleChangePostSortType('new')}
                >
                    <SettingsIcon className="mr-2"/> New
                </button>
                <button
                    className={`${buttonBaseClass} ${
                        postSortType === 'top' ? 'bg-gray-300 dark:bg-gray-800' : 'bg-transparent hover:text-gray-500 dark:hover:text-gray-400'
                    }`}
                    onClick={() => handleChangePostSortType('top')}
                >
                    <TrendingUpIcon className="mr-2"/> Top
                </button>
            </div>

            {/* Display Options */}
            <div>
                <button
                    className={`p-2 rounded ${displayType === 'list' ? 'bg-gray-300 dark:bg-gray-800' : 'bg-transparent'}`}
                    onClick={() => handleChangeDisplayType('list')}
                >
                    <ViewListIcon/>
                </button>
                <button
                    className={`p-2 rounded ${displayType === 'grid' ? 'bg-gray-300 dark:bg-gray-800' : 'bg-transparent'}`}
                    onClick={() => handleChangeDisplayType('grid')}
                >
                    <ViewModuleIcon/>
                </button>
            </div>
        </div>
    );
}
