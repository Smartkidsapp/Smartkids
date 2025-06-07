import { Test, TestingModule } from '@nestjs/testing';
import { EmailMessengerService } from './email-messenger.service';

describe('MessengerService', () => {
  let service: EmailMessengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailMessengerService],
    }).compile();

    service = module.get<EmailMessengerService>(EmailMessengerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
