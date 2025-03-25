import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SortOrder } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { mapUsersFromDb } from '../helpers/user-mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingLogin = await this.userRepository.findByLogin(dto.login);
    if (existingLogin) {
      throw {
        errorsMessages: [{ field: 'login', message: 'login should be unique' }],
      };
    }

    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw {
        errorsMessages: [{ field: 'email', message: 'email should be unique' }],
      };
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, passwordSalt);

    const createdAt = new Date().toISOString();

    const user = await this.userRepository.create({
      login: dto.login,
      email: dto.email,
      passwordHash,
      passwordSalt,
      createdAt,
    });

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      id: user?._id.toString(),
      login: dto.login,
      email: dto.email,
      createdAt,
    };
  }

  async getAll(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ): Promise<{
    items: UserResponseDto[];
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;
  }> {
    const { items, totalCount } = await this.userRepository.findAll(
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    );

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: mapUsersFromDb(items),
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
    };
  }

  async remove(id: string): Promise<boolean> {
    return this.userRepository.remove(id);
  }
}
