import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
  console.log('In GET /auth/signout, Signing out...')
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    console.log('Session found, signing out...')
    await supabase.auth.signOut()
  }

  // TODO, use a different redirect here?
  // import { redirect } from 'next/navigation';
  // how do other tutorials handle redirect after form submissions?
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}