export enum AddressType {
    EOA,
    CONTRACT
}

export interface IBalanceData {
    token_addr: string,
    user_addr: string,
}