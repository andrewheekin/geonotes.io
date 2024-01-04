'use client';

import { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import debounce from 'lodash/debounce';
import { voteOnGeoNote } from '../_lib/actions';
import UpvoteIcon from '../_components/icons/UpvoteIcon';
import UpvoteOutlineIcon from '../_components/icons/UpvoteOutlineIcon';
import DownvoteIcon from '../_components/icons/DownvoteIcon';
import DownvoteOutlineIcon from '../_components/icons/DownvoteOutlineIcon';
import { getCountryCode } from '../_lib/CountriesList';
import StreetViewThumbnail from './StreetViewThumbnail';

export default function GeoNoteCard({ note }) {
  // Set the initial vote status based on the user's vote
  const initialVoteStatus = { upvoted: note.userVote > 0, downvoted: note.userVote < 0 };
  const [voteStatus, setVoteStatus] = useState(initialVoteStatus);

  // Set the initial vote count based on the note's upvotes minus downvotes
  const initialVoteCount = note.upvotes - note.downvotes;
  const [voteCount, setVoteCount] = useState(initialVoteCount);

  const debouncedVoteHandler = debounce(async (geonoteId, voteType) => {
    const res = await voteOnGeoNote(geonoteId, voteType);
  }, 500);

  const handleVoteClick = (voteClick) => {
    if (voteClick === 'REMOVE_UPVOTE') {
      // Case where user removes their upvote
      setVoteCount(voteCount - 1);
      setVoteStatus({ downvoted: false, upvoted: false });
      debouncedVoteHandler(note.id, 'neutral');
    } else if (voteClick === 'REMOVE_DOWNVOTE') {
      // Case where user removes their downvote
      setVoteCount(voteCount + 1);
      setVoteStatus({ downvoted: false, upvoted: false });
      debouncedVoteHandler(note.id, 'neutral');
    } else if (voteClick === 'ADD_UPVOTE') {
      // Case where user adds an upvote
      if (voteStatus.downvoted) {
        // If the user has already downvoted, also remove their downvote
        setVoteCount(voteCount + 2);
      } else {
        setVoteCount(voteCount + 1);
      }
      setVoteStatus({ downvoted: false, upvoted: true });
      debouncedVoteHandler(note.id, 'upvote');
    } else if (voteClick === 'ADD_DOWNVOTE') {
      // Case where user adds a downvote
      if (voteStatus.upvoted) {
        // If the user has already upvoted, also remove their upvote
        setVoteCount(voteCount - 2);
      } else {
        setVoteCount(voteCount - 1);
      }
      setVoteStatus({ downvoted: true, upvoted: false });
      debouncedVoteHandler(note.id, 'downvote');
    }
  };

  return (
    <div className="mb-4 border-4 border-black bg-gray-200 relative shadow rounded">
      {note.region && note.region.length > 0 && (
        <div className="absolute -top-3 left-2 rounded-lg bg-gray-300 border-1 border-gray-700 py-1 px-2">
          <p className="text-xs text-gray font-semibold">regional</p>
        </div>
      )}
      <div className="absolute top-2 right-2 flex flex-col items-center">
        {voteStatus.upvoted ? (
          // User removes their upvote
          <button onClick={() => handleVoteClick('REMOVE_UPVOTE')} className="focus:outline-none">
            <UpvoteIcon />
          </button>
        ) : (
          // User upvotes
          <button onClick={() => handleVoteClick('ADD_UPVOTE')} className="focus:outline-none">
            <UpvoteOutlineIcon />
          </button>
        )}
        <span className="text-sm font-semibold">{voteCount}</span>
        {voteStatus.downvoted ? (
          // User removes their downvote
          <button onClick={() => handleVoteClick('REMOVE_DOWNVOTE')} className="focus:outline-none">
            <DownvoteIcon />
          </button>
        ) : (
          // User downvotes
          <button onClick={() => handleVoteClick('ADD_DOWNVOTE')} className="focus:outline-none">
            <DownvoteOutlineIcon />
          </button>
        )}
      </div>
      <div className="p-2 md:p-3">
        <div className="pr-7">
          <p className="text-xl text-black font-mono font-semibold tracking-tighter">{note.title}</p>
          <p className="text-sm text-black font-mono font-medium tracking-tight">{note.description}</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <Chip
            label={note.country}
            className="mr-1 mb-2 font-mono"
            avatar={<Avatar alt="" src={`https://flagcdn.com/w80/${getCountryCode(note.country).toLowerCase()}.png`} />}
          />
          {note.region &&
            note.region.length > 0 &&
            note.region.map((reg, index) => <Chip className="mr-1 mb-2 bg-green-200 font-mono" key={index} label={reg} />)}
          {note.categories &&
            note.categories.map((category, index) => <Chip className="mr-1 mb-2 font-mono" key={index} label={category} />)}
          {note.author && (
            <p className="text-gray-500 font-mono font-normal tracking-tight text-xs mb-2">added by {note.author}</p>
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
      </div>
    </div>
  );
}
