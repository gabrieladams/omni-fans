import { TokenState } from './token.reducers';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const stakeFeatureSelector = createFeatureSelector<TokenState>('tokens');

export const isTokensLoaded = createSelector(
  stakeFeatureSelector,
  state => state.tokensLoaded
);

export const tokens = createSelector(
  stakeFeatureSelector,
  state => state.tokens
);

export const selectedTokenForEdit = createSelector(
  stakeFeatureSelector,
  state => state.selectedTokenForEdit
);
export const isSelectedTokenForEditLoaded = createSelector(
  stakeFeatureSelector,
  state => state.selectedTokenForEditLoaded
);
export const ownerToken = createSelector(
  stakeFeatureSelector,
  state => state.ownerToken
);


