import { CollectibleState } from './collectible.reducers';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const stakeFeatureSelector = createFeatureSelector<CollectibleState>('collectibles');

export const isCollectiblesLoaded = createSelector(
  stakeFeatureSelector,
  state => state.collectiblesLoaded
);

export const collectibles = createSelector(
  stakeFeatureSelector,
  state => state.collectibles
);

export const selectedCollectibleForEdit = createSelector(
  stakeFeatureSelector,
  state => state.selectedCollectibleForEdit
);
export const isSelectedCollectibleForEditLoaded = createSelector(
  stakeFeatureSelector,
  state => state.selectedCollectibleForEditLoaded
);


