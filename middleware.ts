import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * AUTHENTICATED USER REDIRECTS
   */
  if (user) {
    if (req.nextUrl.pathname === '/login') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Redirecting authenticated user from /login to /account');
      }
      return NextResponse.redirect(new URL('/account', req.url));
    }
  }

  /**
   * UNAUTHENTICATED USER REDIRECTS
   */
  if (!user) {
    if (req.nextUrl.pathname == '/submit') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Redirecting unauthenticated user from /submit to /login');
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

// Config tells Next.js which routes to apply the middleware to
export const config = {
  matcher: ['/', '/account', '/login', '/submit'],
};
