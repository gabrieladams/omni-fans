import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, createSelector, on } from '@ngrx/store';
import { OmniFans } from '../model/omni.fan.model';
import { omniFanActionTypes } from './omnifan.actions';

export interface OmniFansState{
  ownerAccountBalanceLoaded: boolean;
  omniFanOwner:OmniFans;
  isWeb3Initialized:boolean;
}

export const initialState:OmniFansState = {
  ownerAccountBalanceLoaded: false,
  omniFanOwner:null,
  isWeb3Initialized:false

};

export const omniFanReducer = createReducer(
  initialState,

  on(omniFanActionTypes.ownerAccountBalanceLoaded, (state, action) => {
    return {...state,
      omniFanOwner:action.ownerAccountBalance,
      ownerAccountBalanceLoaded:true
    }
  }),

  on(omniFanActionTypes.web3Initiaized, (state, action) => {
    return {...state,
      isWeb3Initialized:true
    }
  }),



);


