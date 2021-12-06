import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { from, Observable, of } from "rxjs";

import { AppState } from "src/app/store/reducers";
import { ToastService } from "src/app/toasts/toast.service";

import { FundsWithdrawalApplicationEvent } from "../model/funds.withdrawal.application.model";
import { NewPendingBorrowerAddedEvent } from "../model/new.pending.borrower.added.model";
import { OmniFans } from "../model/omni.fan.model";
import { getOwnerAccountBalance } from "../store/omnifan.actions";
const Web3 = require("web3");
import { environment } from "src/environments/environment";
import { Owner } from "src/app/owners/model/owner.model";

declare let require: any;
declare let window: any;
//const omniFanABI = require("../../../../../OmniFans/build/contracts/OmniFans.json");

@Injectable({
  providedIn: "root",
})
export class OmniFansService {
   private account: any = null;
  private web3: any;
  private enable: any;
  private web3Initialized:boolean;
  constructor(private store:Store<AppState>,private toastService:ToastService) {}

 private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public initNetwork():Observable<any>{
    const observable = new Observable<any>(subscriber => {
      if (window.ethereum === undefined) {
        this.toastService.warning('Non-Ethereum browser detected. Install MetaMask');
        subscriber.error('Non-Ethereum browser detected. Install MetaMask');
      } else {
        if (typeof window.web3 !== 'undefined') {
          this.web3 = window.web3.currentProvider;
        } else {

          this.web3 = new Web3.providers.HttpProvider(
            environment.production?
            'https://rinkeby.infura.io/v3/9b4c835555dd4522a097e5ceff0ccdab':
            'https://rinkeby.infura.io/v3/9b4c835555dd4522a097e5ceff0ccdab'

            );
        }

        let that=this;
        window.web3 = new Web3(window.ethereum);
        this.enable = this.enableMetaMaskAccount();
        window.ethereum.on('accountsChanged', function (accounts) {
          that.store.dispatch(getOwnerAccountBalance());
          that.toastService.info("Updating Account Info");
        })

        window.ethereum.on('networkChanged', function (networkId) {
          that.store.dispatch(getOwnerAccountBalance());
          that.toastService.info("Updating Network Info");
        });
        window.web3.eth.handleRevert = true
        this.web3Initialized=true;
        that.store.dispatch(getOwnerAccountBalance());
        subscriber.next();
        subscriber.complete();
      }
    })
    return observable;

  }

  public getAccount(): Observable<string> {

    let that=this;
     return from(
      new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((err, retAccount) => {
          if (retAccount.length > 0) {
            that.account = retAccount[0];
            resolve(this.account);
          } else {
            that.toastService.warning("No Accounts Found");
            reject("No accounts found.");
          }
          if (err != null) {
            that.toastService.warning("Error Retriving Account");
            reject("Error retrieving account");
          }
        });
      }) as Promise<string>
    );
  }
  public getOwnerBalance(account: string): Observable<OmniFans> {
    let that = this;

    return from(
      new Promise((resolve, reject) => {
        window.web3.eth.getBalance(account, function (err, balance) {
          if (!err) {
            const retVal = {
              account: account,
              balance: window.web3.utils.fromWei(balance),
            };
            resolve(retVal);
          } else {
            that.toastService.warning("Unable to retrieve Account and Balance");
            reject({ account: "error", balance: 0 });
          }
        });
      }) as Promise<OmniFans>
    );
  }
  /* 
  depositFundsToOmniFansAccount(value) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.addFundsToOmniFansAccount({
            from: that.account,
            value: window.web3.utils.toWei(value.toString(), "ether"),
          });
        })
        .then(function (status) {
          if (status) {
            that.toastService.success(
              "Funds Deposited to OmniFans Account successfully"
            );
            return resolve({ status: true });
          }
        })
        .catch(function (error) {
          that.toastService.warning(
            "Failed to Deposit Funds to OmniFans Account successfully"
          );
          return reject("transfer.service error");
        });
    });
  }

  depositFundsFromLenderToOmniFansAccount(value): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.savePrincipal({
            from: that.account,
            value: window.web3.utils.toWei(value.toString(), "ether"),
          });
        })
        .then(function (status) {
          if (status) {
            that.toastService.success(
              "Funds Deposited to OmniFans Account successfully"
            );
            subscriber.next(status.logs[0].args.lenderContractID.toNumber());
            return subscriber.complete();
          }
        })
        .catch(function (error) {
          that.toastService.warning(
            "Failed to Deposit Funds to OmniFans Account successfully"
          );
          subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  borrrowFundsFromOmniFans(value): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.borrowPrincipal(
            window.web3.utils.toWei(value.toString(), "ether"),
            {
              from: that.account,
            }
          );
        })
        .then(function (status) {
          if (status) {
            that.toastService.success(
              "Funds Borrowed from OmniFans Account successfully"
            );
            subscriber.next(status.logs[0].args.borrowerContractID.toNumber());
            return subscriber.complete();
          }
          return subscriber.error();
        })
        .catch(function (error) {
          that.toastService.warning(
            "Failed to Borrow Funds from OmniFans Account"
          );
          subscriber.error("transfer.service error");
        });
    });
    return observable;
  }

  approveFundsWithdrawalRequestFromOmniFansAccount(args) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance
            .approveFundsWithdrawalFromOmniFans(
              args.owner_address,
              args.stakerWithdrawalRequestID,
              {
                from: that.account,
                value: window.web3.utils.toWei(args.amount.toString(), "ether"),
              }
            )
            .catch((error) => {
              that.toastService.error(error.message);
              throw error;
            });
        })
        .then(function (status) {
          if (status) {
            that.toastService.success("Omnifan withdrawal request approved");
            return resolve({ status: true });
          }
        })
        .catch(function (error) {
          console.log(error);
          that.toastService.warning(
            "Failed to approve Omnifan withdrawal request"
          );
          return reject("transfer.service error");
        });
    });
  }

  approveNewPendingBorrower(args) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.approveBorrower(parseInt(args.borrowerContractID), {
            from: that.account,
            value: window.web3.utils.toWei(args.amount.toString(), "ether"),
          });
        })
        .then(function (status) {
          if (status) {
            that.toastService.success("Omnifan borrowe request approved");
            return resolve({ status: true });
          }
        })
        .catch(function (error) {
          console.log(error);
          that.toastService.warning(
            "Failed to approve Omnifan withdrawal request"
          );
          return reject("transfer.service error");
        });
    });
  }
  withdrawFundsFromOmniFansAccount(value) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.withdrawFundsFromOmniFansAccountApplication(
            window.web3.utils.toWei(value.toString(), "ether"),
            {
              from: that.account,
            }
          );
        })
        .then(function (status) {
          if (status) {
            that.toastService.success(
              "Omnifan withdrawal request submitted successfuly"
            );
            return resolve({ status: true });
          }
        })
        .catch(function (error) {
          console.log(error);
          that.toastService.warning(
            "Failed to submit Omnifan withdrawal request."
          );
          return reject("transfer.service error");
        });
    });
  }

  getNewBorrowerRepayments(): Observable<BorrowerRepayment> {
    const that = this;
    const observable = new Observable<BorrowerRepayment>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract.deployed().then(function (instance) {
        instance.NewBorrowerRepaymentCreated(
          {
            filter: {},
            fromBlock: 0,
          },
          function (error, event) {
            if (!error) {
              event = event.returnValues;
              event = {
                borrower: event.borrower,
                repayment_no: event.repayment_no,
                amount: window.web3.utils.fromWei(event.amount),
                borrowerContractID: event.borrowerContractID,
                currentBorrowerRepaymentID: event.currentBorrowerRepaymentID,
                date: parseInt(event.date) * 1000,
              };
              subscriber.next(event);
            } else {
              subscriber.error(error);
            }
          }
        );
      });
    });
    return observable;
  }*/
  getOwnerPublicAddress(): Observable<string> {
    return of(this.account);
  }
  
  signOwnerNonce(owner: Owner): Observable<Owner> {
    const observable = new Observable<Owner>((subscriber) => {
      window.web3.eth.personal.sign(
        `Sign your one-time-nonce: ${owner.nonce}, to login to omnifan`,
        owner.address,
        "omnifan",
        (error, signature) => {
          owner.signature = signature;
          subscriber.next(owner);
        }
      );
    });
    return observable;
  }
  /*getLenderRepayments(): Observable<LenderRepayment> {
    const that = this;
    const observable = new Observable<LenderRepayment>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract.deployed().then(function (instance) {
        instance.NewLenderRepaymentCreated(
          {
            filter: {},
            fromBlock: 0,
          },
          function (error, event) {
            if (!error) {
              event = event.returnValues;
              event = {
                lender: event.lender,
                lenderContractID: event.lenderContractID,
                currentLenderRepaymentID: event.currentLenderRepaymentID,
                repayment_no: event.repayment_no,
                amount: window.web3.utils.fromWei(event.amount),
                date: parseInt(event.date) * 1000,
              };
              subscriber.next(event);
            } else {
              subscriber.error(error);
            }
          }
        );
      });
    });
    return observable;
  }

  getNewPendingBorrowerAddedEvents(): Observable<NewPendingBorrowerAddedEvent> {
    const that = this;
    const observable = new Observable<NewPendingBorrowerAddedEvent>(
      (subscriber) => {
        const contract = require("@truffle/contract");
        const omniFanContract = contract(omniFanABI);
        omniFanContract.setProvider(that.web3);
        omniFanContract.deployed().then(function (instance) {
          instance.NewPendingBorrowerAdded(
            {
              filter: {},
              fromBlock: 0,
            },
            function (error, event) {
              if (!error) {
                event = event.returnValues;
                event = {
                  borrowerContractID: event.borrowerContractID,
                  principal: window.web3.utils.fromWei(event.principal),
                  borrower: event.borrower,
                  period: event.period,
                  interest_rate: event.interest_rate,
                  start_date: parseInt(event.start_date) * 1000,
                };
                subscriber.next(event);
              } else {
                subscriber.error(error);
              }
            }
          );
        });
      }
    );
    return observable;
  }
  getFundsWithdrawalRequestsFromOmniFansAccount(): Observable<FundsWithdrawalApplicationEvent> {
    const that = this;
    const observable = new Observable<FundsWithdrawalApplicationEvent>(
      (subscriber) => {
        const contract = require("@truffle/contract");
        const omniFanContract = contract(omniFanABI);
        omniFanContract.setProvider(that.web3);
        omniFanContract.deployed().then(function (instance) {
          instance.FundsWithdrawalApplicationFromOmniFans(
            {
              filter: {},
              fromBlock: 0,
            },
            function (error, event) {
              if (!error) {
                event = event.returnValues;
                event = {
                  id: event.id,
                  owner_address: event.owner_address,
                  amount: window.web3.utils.fromWei(event.amount),
                  interest_rate: event.interest_rate,
                  date: parseInt(event.date) * 1000,
                  balance: window.web3.utils.fromWei(event.balance),
                  last_payout: parseInt(event.last_payout) * 1000,
                  interest_amount_bf: window.web3.utils.fromWei(
                    event.interest_amount_bf
                  ),
                  amount_bf: window.web3.utils.fromWei(event.amount_bf),
                  interest: window.web3.utils.fromWei(event.interest),
                  stakerWithdrawalRequestID: event.stakerWithdrawalRequestID,
                };
                subscriber.next(event);
              } else {
                subscriber.error(error);
              }
            }
          );
        });
      }
    );
    return observable;
  }

  getStakerWithdrawalRequest(
    index: number
  ): Observable<StakerWithdrawalRequest> {
    const that = this;
    const observable = new Observable<StakerWithdrawalRequest>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.stakerWithdrawalRequests(index);
        })
        .then(function (result) {
          result = {
            id: result.id,
            owner_address: result.owner_address,
            amount: window.web3.utils.fromWei(result.amount.toString(10)),
            disbursed_amount: window.web3.utils.fromWei(
              result.disbursed_amount.toString(10)
            ),
            interest_rate: result.interest_rate,
            disbursed: result.disbursed,
            disbursed_date: parseInt(result.disbursed_date) * 1000,
            date: parseInt(result.date) * 1000,
            stakerDepositID: result.stakerDepositID,
          };
          if (result) {
            return subscriber.next(result);
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getStakerWithdrawalRequestID(position: number): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.stakerWithdrawalRequestAddressMapping(
            that.account,
            position
          );
        })
        .then(function (result) {
          if (result) {
            return subscriber.next(result.toNumber());
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getStakerWithdrawalRequestsCount(): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.stakerWithdrawalRequestAddressCount(that.account);
        })
        .then(function (result) {
          if (result) {
            subscriber.next(result.toNumber());
            return subscriber.complete();
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getStakerDeposit(index: number): Observable<StakerDeposit> {
    const that = this;
    const observable = new Observable<StakerDeposit>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.stakerDeposits(index);
        })
        .then(function (result) {
          result = {
            id: result.id,
            owner_address: result.owner_address,
            amount: window.web3.utils.fromWei(result.amount.toString(10)),
            interest_rate: result.interest_rate,
            date: parseInt(result.date) * 1000,
            balance: window.web3.utils.fromWei(result.balance.toString(10)),
            last_payout: result.last_payout,
            interest_amount_bf: window.web3.utils.fromWei(
              result.interest_amount_bf.toString(10)
            ),
            amount_bf: window.web3.utils.fromWei(result.amount_bf.toString(10)),
            interest: result.interest,
            isDeposit: result.isDeposit,
            from: result.from,
            stakerWithdrawalRequestID: result.stakerWithdrawalRequestID,
          };
          if (result) {
            return subscriber.next(result);
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getStakerDepositID(position: number): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.stakerDepositAddressMapping(that.account, position);
        })
        .then(function (result) {
          if (result) {
            return subscriber.next(result.toNumber());
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getStakerDepositsCount(): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.stakerDepositAddressCount(that.account);
        })
        .then(function (result) {
          if (result) {
            subscriber.next(result.toNumber());
            return subscriber.complete();
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getLenderPrincipal(index: number): Observable<Lender> {
    const that = this;
    const observable = new Observable<Lender>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.lenders(index);
        })
        .then(function (result) {
          result = {
            id: result.id,
            principal: window.web3.utils.fromWei(result.principal.toString(10)),
            owner_address: result.owner_address,
            period: result.period,
            interest_rate: result.interest_rate,
            start_date: parseInt(result.start_date) * 1000,
            current_repayment: result.current_repayment,
            monthly_repayment: window.web3.utils.fromWei(
              result.monthly_repayment.toString(10)
            ),
          };
          if (result) {
            return subscriber.next(result);
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getLenderPrincipalID(position: number): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.lenderPrincipalAddressMapping(that.account, position);
        })
        .then(function (result) {
          if (result) {
            return subscriber.next(result.toNumber());
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getLenderPrincipalCounts(): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.lenderPrincipalAddressCount(that.account);
        })
        .then(function (result) {
          if (result) {
            subscriber.next(result.toNumber());
            return subscriber.complete();
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }

  getBorrowerPrincipal(index: number): Observable<Borrower> {
    const that = this;
    const observable = new Observable<Borrower>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.borrowers(index);
        })
        .then(function (result) {
          result = {
            id: result.id,
            applied_principal: window.web3.utils.fromWei(
              result.applied_principal.toString(10)
            ),
            owner_address: result.owner_address,
            principal: window.web3.utils.fromWei(result.principal.toString(10)),
            interest_rate: result.interest_rate,
            period: result.period,
            start_date: parseInt(result.start_date) * 1000,
            current_balance: window.web3.utils.fromWei(
              result.current_balance.toString(10)
            ),
            current_repayment: result.current_repayment,
            monthly_repayment: window.web3.utils.fromWei(
              result.monthly_repayment.toString(10)
            ),
            approved: result.approved,
            accepted: result.accepted,
          };
          if (result) {
            return subscriber.next(result);
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getBorrowerPrincipalID(position: number): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.borrowerPrincipalAddressMapping(
            that.account,
            position
          );
        })
        .then(function (result) {
          if (result) {
            return subscriber.next(result.toNumber());
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  }
  getBorrowerPrincipalCounts(): Observable<number> {
    const that = this;
    const observable = new Observable<number>((subscriber) => {
      const contract = require("@truffle/contract");
      const omniFanContract = contract(omniFanABI);
      omniFanContract.setProvider(that.web3);
      omniFanContract
        .deployed()
        .then(function (instance) {
          return instance.borrowerPrincipalAddressCount(that.account);
        })
        .then(function (result) {
          if (result) {
            subscriber.next(result.toNumber());
            return subscriber.complete();
          }
        })
        .catch(function (error) {
          console.log(error);
          return subscriber.error("transfer.service error");
        });
    });
    return observable;
  } */
}
