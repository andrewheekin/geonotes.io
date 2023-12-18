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
    <>
      <div>
        <input id="email" type="text" value={session?.user?.email} disabled className="text-2xl font-bold text-black w-full"/>
      </div>
      <div>
        <input id="fullName" type="text" value={fullname || ''} onChange={(e) => setFullname(e.target.value)} className="text-lg font-bold text-black w-full bg-transparent"/>
      </div>
      <div>
        <label htmlFor="username" className="text-lg font-bold text-black bg-transparent">@</label>
        <input id="username" type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} className='text-lg font-bold text-black bg-transparent'/>
      </div>
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
          className="button primary block underline"
          onClick={() => updateProfile({ fullname, username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block underline" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
