import { Collectible } from '../model/collectible.model';
import { createAction, props } from '@ngrx/store';

export const getCollectibles = createAction(
  '[Collectibles] Get getCollectibles via Service',
  props<{conditions?:any}>()
);

export const clearCollectibles = createAction(
  '[Collectibles] clearCollectibles via Service'
);

export const collectiblesLoaded = createAction(
  '[Collectibles] Collectibles Loaded via Service',
  props<{collectibles:Collectible[]}>()
);


export const collectiblesFailedToLoad = createAction(
  '[Collectibles] collectiblesFailedToLoad Fail via Service',
  props<{error:any}>()
);

export const createCollectible = createAction(
  '[Collectibles] createCollectible Loaded via Service',
  props<{collectible:Collectible}>()
);
export const collectibleCreated = createAction(
  '[Collectibles] Collectible Created via Service',
  props<{collectible:Collectible}>()
);

export const collectibleFailedToCreate = createAction(
  '[Collectibles] collectibleFailedToCreate via Service',
  props<{error:any}>()
);

export const getSelectedCollectibleForEdit = createAction(
  '[OmniPoools] getSelectedCollectibleForEdit via Service',
  props<{id:string}>()
);

export const clearCollectibleForEdit = createAction(
  '[OmniPoools] clearCollectibleForEdit via Service'
);

export const getSelectedCollectibleForEditLoaded = createAction(
  '[Collectibles] getSelectedCollectibleForEditLoaded via Service',
  props<{collectible:Collectible}>()
);


export const getSelectedCollectibleForEditFailed = createAction(
  '[Collectibles] getSelectedCollectibleForEditFailed Fail via Service',
  props<{error:any}>()
);

export const unloadSelectedCollectibleForEdit=createAction('[Collectibles] unloadSelectedCollectibleForEdit via Store')
export const updateCollectible = createAction(
  '[OmniPoools] updateCollectible via Service',
  props<{collectible:Collectible,navigationFalse?:boolean}>()
);

export const updateCollectibleSuccess = createAction(
  '[Collectibles] updateCollectibleSuccess via Service',
  props<{collectible:Collectible}>()
);


export const updateCollectibleFailed = createAction(
  '[Collectibles] updateCollectibleFailed Fail via Service',
  props<{error:any}>()
);








export const collectibleActionTypes = {
  getCollectibles,
  collectiblesLoaded,
  clearCollectibles,
  createCollectible,
  collectiblesFailedToLoad,
  collectibleCreated,
  collectibleFailedToCreate,
  getSelectedCollectibleForEdit,
  getSelectedCollectibleForEditLoaded,
  getSelectedCollectibleForEditFailed,
  unloadSelectedCollectibleForEdit,
  updateCollectible,
  clearCollectibleForEdit,
  updateCollectibleFailed,
  updateCollectibleSuccess
};
