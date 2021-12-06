
export interface NewPendingBorrowerAddedEvent {
  borrower: string,
  borrowerContractID:number,
  principal: number,
  period: number,
  interest_rate: number,
  start_date: number
}
