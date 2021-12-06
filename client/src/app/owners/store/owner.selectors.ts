import { OwnerState } from './owner.reducers';
import { Owner } from '../model/owner.model';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectAll, selectIds } from './owner.reducers';

export const ownerFeatureSelector = createFeatureSelector<OwnerState>('owners');

export const getAllOwners = createSelector(
  ownerFeatureSelector,
  selectAll
);

export const areOwnersLoaded = createSelector(
  ownerFeatureSelector,
  state => state.ownersLoaded
);
export const loggedInOwner = createSelector(
  ownerFeatureSelector,
  state => state.loggedInOwner
);



export const isOwnerLoggedIn = createSelector(
  ownerFeatureSelector,
  state => state.loginSuccess
);
