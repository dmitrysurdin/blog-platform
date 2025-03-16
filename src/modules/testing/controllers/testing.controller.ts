import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from '../services/testing.service';
import { DATABASE } from '../../../constants';

@Controller(DATABASE.TESTING_COLLECTION)
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearDb() {
    await this.testingService.clearDb();
  }
}
