import { OmniFans } from '../model/omni.fan.model';
import { createAction, props } from '@ngrx/store';
import {Update} from '@ngrx/entity';
import { OmniFansState } from './omnifan.reducers';

export const getOwnerAccountBalance = createAction(
  '[Stakes] Get getOwnerAccountBalance via Ethereum'
);

export const initWeb3 = createAction(
  '[Stakes] Initialize Web3 via Ethereum'
);
export const web3Initiaized = createAction(
  '[Stakes] Web3 Initialized via Ethereum'
);
export const setWeb3Initiaized = createAction(
  '[Stakes] Web3 setWeb3Initiaized via Ethereum'
);

export const getIsWeb3Initialized = createAction(
  '[Stakes] Web3 getIsWeb3Initialized via Ethereum'
);
export const emptyAction = createAction(
  '[Stakes] Web3 emptyAction via Ethereum'
);

export const web3InitializationFailed = createAction(
  '[Stakes] Web3 Initialization Failed via Ethereum'
);
export const ownerAccountBalanceLoaded = createAction(
  '[Stakes List] ownerAccountBalanceLoaded Loaded via Ethereum',
  props<{ownerAccountBalance: OmniFans}>()
);

export const omniFanActionTypes = {
  initWeb3,
  web3Initiaized,
  web3InitializationFailed,
  getOwnerAccountBalance,
  emptyAction,
  ownerAccountBalanceLoaded,
  getIsWeb3Initialized,
  setWeb3Initiaized
};
