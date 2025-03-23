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
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { DATABASE } from '../../../constants';
import { Response } from 'express';
import { BasicAuthGuard } from '../../../auth/guards/basic-auth.guard';

@Controller(DATABASE.USERS_COLLECTION)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const isDeleted = await this.userService.remove(id);

    if (!isDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
