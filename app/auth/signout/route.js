import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation';

export async function GET(req) {
  console.log('In GET /auth/signout, Signing out...');
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('supabase.auth.session in /auth/signout', session);

  if (session) {
    console.log('Session found, signing out...');
    await supabase.auth.signOut();
  }

  console.log('Redirecting to /');

  // return NextResponse.redirect(new URL('/', req.url), { status: 302 })
  return redirect('/');
}
