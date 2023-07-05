import { Test, TestingModule } from '@nestjs/testing';
import { EeeController } from './eee.controller';
import { EeeService } from './eee.service';

describe('EeeController', () => {
  let controller: EeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EeeController],
      providers: [EeeService],
    }).compile();

    controller = module.get<EeeController>(EeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
