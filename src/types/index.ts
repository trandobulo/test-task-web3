export enum AddressType {
    EOA,
    CONTRACT
}

export interface IBalanceData {
    token_addr: string,
    user_addr: string,
}

export interface ITransferData {
    token_addr: string,
    user_addr: string,
    recipient_addr: string,
    amount: number
}

export interface ITransferResponse {
    user_balance: string,
    recipient_balance: string,
}