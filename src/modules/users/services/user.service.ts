import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { SortOrder } from 'mongoose';
import { mapUsersFromDb } from '../helpers/user-mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  //TODO: refactor
  async create(createUserDto: CreateUserDto) {
    const existingUsers = await this.userRepository.findAll(
      1,
      1,
      'createdAt',
      'desc',
      createUserDto.login,
      createUserDto.email,
    );
    if (existingUsers.totalCount > 0) {
      throw new ConflictException('Login or email already exists');
    }

    const user = await this.userRepository.create(createUserDto);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return { ...createUserDto, id: user._id.toString() as string };
  }

  async getAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ) {
    const { items, totalCount } = await this.userRepository.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortDirection as SortOrder,
      searchLoginTerm,
      searchEmailTerm,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mapUsersFromDb(items),
    };
  }

  async remove(id: string) {
    const deleted = await this.userRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
