'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Avatar from './Avatar';

export default function AccountForm({ session }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div>
        <label htmlFor="username" className="text-2xl font-bold text-black dark:text-white bg-transparent">
          @
        </label>
        <input
          id="username"
          type="text"
          placeholder="Your username"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
          className="text-2xl font-bold text-black dark:text-white bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-sm"
        />
      </div>
      <div className="flex mb-4 mt-2">
        <div className="text-md font-bold text-black dark:text-white mr-1">Email:</div>
        <input
          id="email"
          type="text"
          value={session?.user?.email}
          disabled
          className="text-md font-bold text-black dark:text-white w-full"
        />
      </div>
      {/* Hide name field for now */}
      {/* <div>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
          className="text-md font-bold text-black dark:text-white w-full bg-transparent"
        />
      </div> */}

      {/* Hide website field for now, TODO: determine what to do with this field */}
      {/* <div>
        <label htmlFor="website">Website</label>
        <input id="website" type="url" value={website || ''} onChange={(e) => setWebsite(e.target.value)} />
      </div> */}

      <Avatar
        uid={user?.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ fullname, username, website, avatar_url: url });
        }}
      />

      <div>
        <button
          className="button primary block p-2 my-2 mr-2 bg-gray-300 dark:bg-gray-800 rounded-md text-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600"
          onClick={() => updateProfile({ fullname, username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update profile'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="GET">
          <button className="button primary block p-2 my-2 mr-2 bg-blue-400 dark:bg-blue-800 rounded-md text-md font-semibold hover:bg-blue-300 dark:hover:bg-blue-700" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
