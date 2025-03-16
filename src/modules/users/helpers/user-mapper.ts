import { User } from '../schemas/user.schema';
import { UserResponseDto } from '../dto/user-response.dto';

export const mapUserFromDb = (user: User): UserResponseDto => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  id: user._id.toString() as string,
  login: user.login,
  email: user.email,
  createdAt: user.createdAt,
});

export const mapUsersFromDb = (users: User[]): UserResponseDto[] =>
  users.map(mapUserFromDb);
