import { Injectable } from '@nestjs/common';
import { TestingRepository } from '../repositories/testing.repository';

@Injectable()
export class TestingService {
  constructor(private readonly testingRepository: TestingRepository) {}

  async clearDb(): Promise<void> {
    await this.testingRepository.clearDb();
  }
}
