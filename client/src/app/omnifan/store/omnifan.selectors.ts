import { OmniFansState } from './omnifan.reducers';
import { OmniFans } from '../model/omni.fan.model';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const omniFanFeatureSelector = createFeatureSelector<OmniFansState>('omnifan');


export const isOwnerAccountBalanceLoaded = createSelector(
  omniFanFeatureSelector,
  state => state.ownerAccountBalanceLoaded
);

export const ownerAccountBalance = createSelector(
  omniFanFeatureSelector,
  state => state.omniFanOwner
);

export const isWeb3Initialized = createSelector(
  omniFanFeatureSelector,
  state => state.isWeb3Initialized
);


