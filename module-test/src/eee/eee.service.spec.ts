import { Test, TestingModule } from '@nestjs/testing';
import { EeeService } from './eee.service';

describe('EeeService', () => {
  let service: EeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EeeService],
    }).compile();

    service = module.get<EeeService>(EeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
