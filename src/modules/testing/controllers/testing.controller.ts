import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from '../services/testing.service';
import { DATABASE, HTTP_CODES } from '../../../constants';

@Controller(DATABASE.TESTING_COLLECTION)
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Delete('all-data')
  @HttpCode(HTTP_CODES.NO_CONTENT)
  async clearDb() {
    await this.testingService.clearDb();
  }
}
