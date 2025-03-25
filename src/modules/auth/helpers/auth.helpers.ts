import { WithId } from 'mongodb';
import { AuthUserClientModel, AuthUserDbModel } from '../types/auth.types';

export const mapAuthUserFromDb = (
  userDb: WithId<AuthUserDbModel>,
): AuthUserClientModel => {
  return {
    userId: userDb._id.toString(),
    login: userDb.login,
    email: userDb.email,
  };
};
