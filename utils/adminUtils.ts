import { User } from '../db';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

export async function checkIfUserIsAdmin(
  firebaseUser: UserRecord
): Promise<boolean> {
  const { email } = firebaseUser;
  const dbUser = await User.findOne({ where: { email } });

  if (!dbUser) {
    console.log('User not found in the system');
    return false;
  }

  return dbUser.isAdmin;
}
