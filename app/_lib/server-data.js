'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const cookieStore = cookies();
// Using createServerComponentClient() instead of createServerActionClient() since these functions is called on initial render
const supabase = createServerComponentClient({ cookies: () => cookieStore });

export async function getUserSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Fetch User Session.',
    };
  }
}
