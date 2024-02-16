import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getBalance', () => {
    it('should return balance', async () => {
      const mockBalance = 100;
      jest.spyOn(appService, 'getBalance').mockResolvedValue(mockBalance);

      const result = await appController.getBalance('token123', 'user123');

      expect(result).toBe(mockBalance);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Sample error');
      jest.spyOn(appService, 'getBalance').mockRejectedValue(mockError);

      const result = await appController.getBalance('token123', 'user123');

      expect(result).toBeInstanceOf(HttpException);
    });
  });

  describe('transfer', () => {
    it('should transfer and return result', async () => {
      const mockTransferData = {
        token_addr: '0x12',
        user_addr: '0x34',
        recipient_addr: '0x56',
        amount: 123
      };

      const mockAuthorization = 'Bearer mockToken';
      const mockResult = {
        user_balance: '123',
        recipient_balance: '456',
      };

      jest.spyOn(appService, 'transfer').mockResolvedValue(mockResult);

      const result = await appController.transfer(mockAuthorization, mockTransferData);

      expect(result).toBe(mockResult);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Sample error');
      jest.spyOn(appService, 'transfer').mockRejectedValue(mockError);

      const result = await appController.transfer('Bearer mockToken', {
        token_addr: '0x12',
        user_addr: '0x34',
        recipient_addr: '0x56',
        amount: 123
      });

      expect(result).toBeInstanceOf(HttpException);
    });
  });
});
