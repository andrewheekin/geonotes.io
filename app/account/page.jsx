import { getUserSession } from '../_lib/server-data';
import AccountForm from './AccountForm';

export default async function Account() {
  const session = await getUserSession();

  return (
    <div className="max-w-xl w-full py-2">
      <AccountForm session={session} />
    </div>
  );
}
