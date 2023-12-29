'use server';

// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NUM_INITIAL_GEONOTES_AUTHENTICATED, NUM_INITIAL_GEONOTES_UNAUTHENTICATED } from './helpers';

export async function voteOnGeoNote(geonoteId, voteType) {
  noStore();

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // Check user authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null || user === undefined) {
    return { message: 'User is not authenticated.' };
  }
  const { id } = user;

  // voteType is either: 'upvote', 'downvote', or 'neutral'
  let voteValue = 0;
  if (voteType === 'upvote') {
    voteValue = 1;
  } else if (voteType === 'downvote') {
    voteValue = -1;
  }

  try {
    // If voteValue is 0, delete vote record from geonote_vote
    if (voteValue === 0) {
      let { error: removeVoteRecordError } = await supabase
        .from('geonote_vote')
        .delete()
        .eq('geonote_id', geonoteId)
        .eq('user_id', id);

      if (removeVoteRecordError) throw removeVoteRecordError;
    } else {
      // If voteValue is 1 or -1, upsert vote in geonote_vote
      let { error } = await supabase.from('geonote_vote').upsert({
        geonote_id: geonoteId,
        user_id: id,
        vote: voteValue,
        created_at: new Date(),
      });
      if (error) throw error;
    }
  } catch (error) {
    console.error('geonote_vote upsert error: ', error);
    return { message: `Failed to ${voteType} GeoNote.` };
  }

  let voteCount = [];
  try {
    // Update the geonote record "upvotes" and "downvotes" columns
    // Get the geonote_vote_count record for the geonote_id
    let { data, error: voteCountError } = await supabase
      .from('geonote_vote_count')
      .select('*')
      .eq('geonote_id', geonoteId);

    voteCount = data;
    if (voteCountError) throw voteCountError;
  } catch (error) {
    console.error('geonote_vote_count select error: ', error);
    return { message: `Failed to ${voteType} GeoNote.` };
  }

  try {
    // Now save the vote count from geonote_vote_count "upvotes" and "downvotes" columns to the geonote record
    const updatedVotesObj = {
      upvotes: parseInt(voteCount[0].upvotes),
      downvotes: parseInt(voteCount[0].downvotes),
    };

    let { error } = await supabase.from('geonote').update(updatedVotesObj).eq('id', geonoteId);

    if (error) throw error;

    return { message: `Successfully ${voteType}d GeoNote.` };
  } catch (error) {
    console.error('geonote update error: ', error);
    return { message: `Failed to ${voteType} GeoNote.` };
  }
}

async function enrichGeoNotesWithVotes(userId, geonotes) {
  /**
   * If the user is authenticated, enrich the geoNotes in fetchGeoNotes with a “userVote” property
   */

  noStore();

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  let enrichedGeoNotes = [];

  // Get an array of geonote IDs
  const geonoteIds = geonotes.map((geonote) => geonote.id);

  // Fetch the votes for the geonotes from geonote_vote where user_id = userId and geonote_id in geonoteIds
  const { data: votes, error: voteError } = await supabase
    .from('geonote_vote')
    .select('*')
    .eq('user_id', userId)
    .in('geonote_id', geonoteIds);

  if (voteError) {
    console.error('Database Error: ', voteError);
    return {
      message: 'Database Error: Failed to Fetch Votes.',
    };
  }

  // Map the votes to the geonotes
  enrichedGeoNotes = geonotes.map((geonote) => {
    const vote = votes.find((vote) => vote.geonote_id === geonote.id);

    if (vote) {
      return { ...geonote, userVote: vote.vote };
    } else {
      return { ...geonote, userVote: 0 };
    }
  });

  return enrichedGeoNotes;
}

export async function fetchGeoNotes({ searchParams }) {
  noStore();

  /**
   *
   * If user is unathenticated, limit to fetching 8 geonotes, scrape all other searchParams off
   *
   * If searchParams is empty, return all the GeoNotes
   *
   * Otherwise, return the GeoNotes that match the searchParams
   * Example searchParams:
   * {
   *   countries: 'Albania,Bhutan,United States',
   *   categories: 'Cars, Trucks (Non-Google)',
   *   regions: 'Alberta'
   * }
   */

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // Check user authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null || user === undefined) {
    // User is not authenticated, return 8 GeoNotes
    const { data, error } = await supabase.from('geonote').select('*').limit(NUM_INITIAL_GEONOTES_UNAUTHENTICATED);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  }

  const hasCountries =
    Object.prototype.hasOwnProperty.call(searchParams, 'countries') && searchParams.countries.length > 0;
  const hasCategories =
    Object.prototype.hasOwnProperty.call(searchParams, 'categories') && searchParams.categories.length > 0;
  const hasAuthor = Object.prototype.hasOwnProperty.call(searchParams, 'author') && searchParams.author;
  const hasRegions = Object.prototype.hasOwnProperty.call(searchParams, 'regions') && searchParams.regions.length > 0;
  const hasPostSortType = Object.prototype.hasOwnProperty.call(searchParams, 'postSortType') && searchParams.postSortType;

  let countries = [];
  let regions = [];
  let categories = [];
  let postSortType = '';
  let author = '';

  if (hasCountries) {
    countries = searchParams.countries.split(',');
  }
  if (hasRegions) {
    regions = searchParams.regions.split(',');
  }
  if (hasCategories) {
    categories = searchParams.categories.split(',');
  }
  if (hasAuthor) {
    author = searchParams.author;
  }

  if (hasAuthor) {
    /**
     * Case where author is provided
     */
    const { data, error } = await supabase
      .from('geonote')
      .select('*')
      .eq('author_id', author)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    // Enrich the GeoNotes with the user's votes
    const enrichedGeoNotes = await enrichGeoNotesWithVotes(user.id, data);
    return enrichedGeoNotes;
  }

  if (hasCountries && hasCategories) {
    /**
     * Case where both countries and categories are provided
     */
    // Fetch geonote IDs from the mapping table that match all categories
    const { data: mappingData, error: mappingError } = await supabase
      .from('geonote_category_mapping')
      .select('*')
      .in('category_name', categories);

    if (mappingError) {
      console.error('Database Error: ', mappingError);
      return {
        message: 'Database Error: Failed to Fetch GeoNote Categories.',
      };
    }

    // Group the mappingData by geonote_id
    const geonoteCategoryMap = mappingData.reduce((acc, item) => {
      if (!acc[item.geonote_id]) {
        acc[item.geonote_id] = new Set();
      }
      acc[item.geonote_id].add(item.category_name);
      return acc;
    }, {});

    const filteredGeonoteIds = Object.entries(geonoteCategoryMap)
      .filter(([_, categorySet]) => categories.every((cat) => categorySet.has(cat)))
      .map(([geonoteId, _]) => geonoteId);

    // Fetch the geonotes that match these IDs and are in the selected countries
    const { data, error } = await supabase
      .from('geonote')
      .select('*')
      .in('id', filteredGeonoteIds)
      .in('country', countries);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    // Enrich the GeoNotes with the user's votes
    const enrichedGeoNotes = await enrichGeoNotesWithVotes(user.id, data);
    return enrichedGeoNotes;
  } else if (hasCountries) {
    /**
     * Case where only countries are provided
     */
    // Only countries filter is provided
    const { data, error: countriesError } = await supabase.from('geonote').select('*').in('country', countries);

    if (countriesError) {
      console.error('Database Error: ', countriesError);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    // Enrich the GeoNotes with the user's votes
    const enrichedGeoNotes = await enrichGeoNotesWithVotes(user.id, data);
    return enrichedGeoNotes;
  } else if (hasCategories) {
    /**
     * Case where only categories are provided
     */
    const { data: mappingData, error: mappingError } = await supabase
      .from('geonote_category_mapping')
      .select('*')
      .in('category_name', categories);

    if (mappingError) {
      console.error('Database Error: ', mappingError);
      return {
        message: 'Database Error: Failed to Fetch GeoNote Categories.',
      };
    }

    // Group the mappingData by geonote_id
    const geonoteCategoryMap = mappingData.reduce((acc, item) => {
      if (!acc[item.geonote_id]) {
        acc[item.geonote_id] = new Set();
      }
      acc[item.geonote_id].add(item.category_name);
      return acc;
    }, {});

    const filteredGeonoteIds = Object.entries(geonoteCategoryMap)
      .filter(([_, categorySet]) => categories.every((cat) => categorySet.has(cat)))
      .map(([geonoteId, _]) => geonoteId);

    const { data, error: categoryError } = await supabase.from('geonote').select('*').in('id', filteredGeonoteIds);

    if (categoryError) {
      console.error('Database Error: ', categoryError);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }
    // Enrich the GeoNotes with the user's votes
    const enrichedGeoNotes = await enrichGeoNotesWithVotes(user.id, data);
    return enrichedGeoNotes;
  } else {
    /**
     * Case where No filters provided, return default set of GeoNotes
     *
     */

    const { data, error } = await supabase.from('geonote').select('*').limit(NUM_INITIAL_GEONOTES_AUTHENTICATED);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    // Enrich the GeoNotes with the user's votes
    const enrichedGeoNotes = await enrichGeoNotesWithVotes(user.id, data);
    return enrichedGeoNotes;
  }
}

export async function createGeoNote(formData) {
  noStore();

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const {
    data: {
      user: { id, email },
    },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from('profiles').select('username').eq('id', id);

  // Supabase returns results as an array, take the first element. Default to the user's email if no username is set.
  const username = data[0].username || email?.split('@')[0];

  const { title, description, categories, country, region, streetViewLink } = formData;
  const created_at = new Date();

  /**
   * Parse out the Street View URL
   */
  const lat = streetViewLink.match(/@(-?\d+\.\d+),/)[1];
  const lng = streetViewLink.match(/@-?\d+\.\d+,(-?\d+\.\d+)/)[1];
  const heading = streetViewLink.match(/,(\d+\.?\d*)h,/)[1];
  const zoom = streetViewLink.match(/,(\d+\.?\d*)y,/)[1];
  const pitch = parseFloat(streetViewLink.match(/,(\d+\.?\d*)t/)[1]) - 90.0;

  try {
    let addedGeoNote = await supabase
      .from('geonote')
      .insert([
        {
          title,
          description,
          categories,
          created_at,
          author: username,
          author_id: id,
          country,
          streetviewurl: streetViewLink,
          region,
          lat,
          lng,
          heading,
          zoom,
          pitch,
        },
      ])
      .select();

    console.log('GeoNote created successfully!', addedGeoNote);

    // Insert into geonote_category_mapping table
    await supabase.from('geonote_category_mapping').insert(
      categories.map((category) => ({
        geonote_id: addedGeoNote?.data[0].id,
        category_name: category,
      }))
    );

    // TODO: refactor this redirect
    // revalidatePath('/');
    // redirect('/');

    // Giving the error:
    //  ⨯ Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported. at stringify (<anonymous>)
    // return NextResponse.redirect(`${process.env.SITE_URL}/`, { status: 302 });
  } catch (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Create GeoNote.',
    };
  }
}
