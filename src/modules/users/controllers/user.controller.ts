import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { DATABASE } from '../../../constants';
import { Response } from 'express';

@Controller(DATABASE.USERS_COLLECTION)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async getAll(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
  ) {
    return this.userService.getAll(
      Number(pageSize) || 10,
      Number(pageNumber) || 1,
      sortBy || 'createdAt',
      sortDirection === 'asc' ? 'asc' : 'desc',
      searchLoginTerm || null,
      searchEmailTerm || null,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const isDeleted = await this.userService.remove(id);

    if (!isDeleted) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
