import { getUserSession } from '../_lib/server-data';
import AccountForm from './AccountForm';

export default async function Account() {
  const session = await getUserSession();

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="col-6">
        <AccountForm session={session} />
      </div>
    </div>
  );
}
