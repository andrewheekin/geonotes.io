'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthForm() {
  const supabase = createClientComponentClient();

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
  console.log('redirectUrl', redirectUrl);

  return (
    <Auth
      appearance={{
        theme: ThemeSupa,
        style: {
          button: {
            backgroundColor: 'lightblue',
            borderColor: '#86b6c5',
            borderWidth: '1px',
            color: 'black',
            letterSpacing: '-0.02em',
            fontWeight: 'semibold',
            fontSize: '16px',
          },
          input: {
            backgroundColor: 'white',
            borderColor: '#86b6c5',
            borderWidth: '1px',
            color: 'black',
            letterSpacing: '-0.01em',
            fontWeight: 'semibold',
            fontSize: '16px',
          },
        },
      }}
      supabaseClient={supabase}
      view="magic_link"
      showLinks={false}
      providers={[]}
      redirectTo={redirectUrl} // Note, on Supabase this comes from the "Site URL" ("Auth" -> "URL Configuration") and not this variable
    />
  );
}
