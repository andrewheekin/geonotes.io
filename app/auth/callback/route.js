'use server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation';

export async function GET(req) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  console.log('in auth/callback/route.js GET')
  console.log('req.url', req.url)

  // return NextResponse.redirect(new URL('/account', req.url))
  redirect('/account')
}