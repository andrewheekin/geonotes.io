import { getUserSession } from '../_lib/server-data';
import AccountForm from './AccountForm';
import GeoNotesList from '../_components/GeoNotesList';

export default async function Account() {
  const session = await getUserSession();

  return (
    <div className="max-w-3xl w-full py-2">
      <AccountForm session={session} />
      <h1 className="text-2xl font-bold text-black mt-6 mb-2">Your GeoNotes</h1>
      <GeoNotesList searchParams={{ author: session?.user?.id }} />
    </div>
  );
}
