import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AccountForm from './AccountForm';

export default async function Account() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="col-6">
        <AccountForm session={session} />
      </div>
    </div>
  );
}
