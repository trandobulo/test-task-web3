import { Injectable } from '@nestjs/common';
import * as process from 'process';
import ERC20ABI from './abi';
import { Contract, JsonRpcProvider } from 'ethers';
import { AddressType, IBalanceData } from './types';

@Injectable()
export class AppService {
  private readonly provider: JsonRpcProvider;
  constructor() {
    this.provider = new JsonRpcProvider(process.env.RPC_URL, Number(process.env.CHAIN_ID));
  }

  async addressCheck(address: string, addressType: AddressType) {

    try {
      const code = await this.provider.getCode(address);

      if (code === '0x' && addressType === AddressType.CONTRACT) {
        throw new Error(`Invalid Input. Address of token you provide: ${address} is EOA address`);
      }

      if (code !== '0x' && addressType === AddressType.EOA) {
        throw new Error(`Invalid Input. Address of token you provide: ${address} is Smart Contract address`);
      }

    } catch {
      if (addressType === AddressType.CONTRACT) {
        throw new Error(`Invalid Input ${address}. Check address of token contract`);
      } else {
        throw new Error(`Invalid Input ${address}. Check address of EOA`);
      };
    }
  }

  async getBalance({ token_addr, user_addr }: IBalanceData) {

    await this.addressCheck(token_addr, AddressType.CONTRACT);
    await this.addressCheck(user_addr, AddressType.EOA);

    const tokenContract = new Contract(token_addr, ERC20ABI, this.provider);

    return (await tokenContract.balanceOf(user_addr)).toString();
  }
}