import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { SortOrder } from 'mongoose';

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

    return this.userRepository.create(createUserDto);
  }

  async getAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ) {
    return this.userRepository.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortDirection as SortOrder,
      searchLoginTerm,
      searchEmailTerm,
    );
  }

  async remove(id: string) {
    const deleted = await this.userRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
