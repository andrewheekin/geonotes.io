import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getUserSession() {
  const cookieStore = cookies();
  // Using createServerComponentClient() instead of createServerActionClient() since these functions is called on initial render
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

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
