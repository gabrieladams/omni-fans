
export interface FundsWithdrawalApplicationEvent {
  id:number;
  amount: number;
  balance: number;
  interest:number,
  owner_address:string,
  stakerWithdrawalRequestID:number
}
