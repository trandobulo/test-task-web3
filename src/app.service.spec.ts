import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AddressType } from './types';
import { JsonRpcProvider, Contract, Wallet, ethers } from 'ethers';
import ERC20ABI from './abi';

jest.mock('ethers');

describe('AppService', () => {
    let appService: AppService;
    let mockJsonRpcProvider: jest.Mocked<JsonRpcProvider>;

    beforeEach(async () => {
        mockJsonRpcProvider = new JsonRpcProvider() as jest.Mocked<JsonRpcProvider>;

        jest.spyOn(ethers, 'Contract').mockImplementation(() => {
            return {
                balanceOf: jest.fn().mockResolvedValue('123'),
                transfer: jest.fn().mockResolvedValue({
                    wait: jest.fn().mockResolvedValue({})
                }),
                decimals: jest.fn().mockResolvedValue(6)
            } as any as jest.Mocked<Contract>
        })
        jest.spyOn(ethers, 'parseUnits').mockImplementation((value, decimals) => BigInt(value));
        jest.spyOn(ethers, 'formatUnits').mockImplementation((value, decimals) => value.toString());

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                { provide: JsonRpcProvider, useValue: mockJsonRpcProvider },
            ],
        }).compile();

        appService = module.get<AppService>(AppService);
    });

    describe('addressCheck', () => {
        it('should throw error for invalid contract address', async () => {
            mockJsonRpcProvider.getCode.mockResolvedValue('0x');
            await expect(appService.addressCheck('invalidContractAddress', AddressType.CONTRACT)).rejects.toThrow();
        });

        it('should throw error for invalid EOA address', async () => {
            mockJsonRpcProvider.getCode.mockResolvedValue('0x01');
            await expect(appService.addressCheck('invalidEOAAddress', AddressType.EOA)).rejects.toThrow();
        });

        it('should handle errors and throw specific error messages', async () => {
            mockJsonRpcProvider.getCode.mockRejectedValue(new Error('Mock error'));
            await expect(appService.addressCheck('anyAddress', AddressType.CONTRACT)).rejects.toThrow('Invalid Input anyAddress. Check address of token contract');
            await expect(appService.addressCheck('anyAddress', AddressType.EOA)).rejects.toThrow('Invalid Input anyAddress. Check address of EOA');
        });
    });

    describe('getBalance', () => {
        it('should return balance', async () => {
            jest.spyOn(appService, 'addressCheck').mockResolvedValue();

            const result = await appService.getBalance({ token_addr: 'token123', user_addr: 'user123' });

            expect(result).toBe('123');
        });

        it('should handle errors with thrown HttpException', async () => {
            const mockError = new Error('Sample error');
            jest.spyOn(appService, 'addressCheck').mockRejectedValue(mockError);
            await expect(appService.getBalance({ token_addr: 'token123', user_addr: 'user123' })).rejects.toThrow();
        });
    });

    describe('transfer', () => {
        it('should transfer and return result', async () => {


            jest.spyOn(appService, 'addressCheck').mockResolvedValue();
            const mockTransferData = {
                token_addr: 'token123',
                user_addr: 'user123',
                recipient_addr: 'recipient123',
                amount: 10,
            };

            const mockSecretKey = 'mockSecretKey';

            const result = await appService.transfer(mockTransferData, mockSecretKey);
            expect(result).toHaveProperty('user_balance');
            expect(result).toHaveProperty('recipient_balance');
        });

        it('should handle errors with thrown HttpException', async () => {
            const mockError = new Error('Sample error');
            jest.spyOn(appService, 'addressCheck').mockRejectedValue(mockError);

            const mockTransferData = {
                token_addr: 'token123',
                user_addr: 'user123',
                recipient_addr: 'recipient123',
                amount: 10,
            };

            await expect(appService.transfer(mockTransferData, 'mockSecretKey')).rejects.toThrow();
        });
    });
});
