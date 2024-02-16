import { Injectable } from '@nestjs/common';
import * as process from 'process';
import ERC20ABI from './abi';
import { Contract, JsonRpcProvider, Wallet, formatUnits, parseUnits } from 'ethers';
import { AddressType, IBalanceData, ITransferData, ITransferResponse } from './types';

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

  async transfer({ token_addr, user_addr, recipient_addr, amount }: ITransferData, secretKey: string): Promise<ITransferResponse> {
    await this.addressCheck(token_addr, AddressType.CONTRACT);
    await this.addressCheck(user_addr, AddressType.EOA);
    await this.addressCheck(recipient_addr, AddressType.EOA);

    const wallet = new Wallet(secretKey, this.provider);
    const tokenContract = new Contract(token_addr, ERC20ABI, wallet);

    const decimals = await tokenContract.decimals();

    if (String(amount).split('.')[1]?.length > decimals) {
      throw new Error(`Inputted amount exceeds token decimals length: ${decimals}`)
    }

    const senderBalance = await tokenContract.balanceOf(user_addr);

    const formattedAmount = parseUnits(String(amount), decimals);

    if (senderBalance < BigInt(formattedAmount)) {
      throw new Error(`Amount exceeds sender balance: ${formatUnits(senderBalance, decimals)}`);
    }

    try {
      const tx = await tokenContract.transfer(recipient_addr, formattedAmount);
      await tx.wait();

      return {
        user_balance: (await tokenContract.balanceOf(user_addr)).toString(),
        recipient_balance: (await tokenContract.balanceOf(recipient_addr)).toString()
      }

    } catch (e) {
      throw new Error(`Error while transaction: ${e.data}`);
    }
  }
}