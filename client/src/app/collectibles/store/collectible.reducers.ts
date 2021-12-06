import { Collectible } from '../model/collectible.model';
import { EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { collectibleActionTypes } from './collectible.actions';

export interface CollectibleState extends EntityState<Collectible> {
  collectiblesLoaded: boolean;
  collectibles:Collectible[];
  selectedCollectibleForEdit:Collectible,
  selectedCollectibleForEditLoaded:boolean
}


export const initialState = {
  collectiblesLoaded: false,
  collectibles:[]
};

export const collectibleReducer = createReducer(
  initialState,
  on(collectibleActionTypes.collectiblesLoaded, (state, action) => {

    return {
      ...state,
      collectibles:action.collectibles,
      collectiblesLoaded:true
    };
  }),
  on(collectibleActionTypes.unloadSelectedCollectibleForEdit, (state, action) => {

    return {
      ...state,
      selectedCollectibleForEdit:null,
      selectedCollectibleForEditLoaded:false
    };
  }),

  on(collectibleActionTypes.getSelectedCollectibleForEditLoaded, (state, action) => {

    return {
      ...state,
      selectedCollectibleForEdit:action.collectible,
      selectedCollectibleForEditLoaded:true
    };
  }),
  on(collectibleActionTypes.updateCollectible, (state, action) => {

    return {
      ...state,
      selectedCollectibleForEdit:action.collectible,
      selectedCollectibleForEditLoaded:true
    };
  }),


  on(collectibleActionTypes.clearCollectibles, (state, action) => {
    return {...state,
      collectibles:[],
      collectiblesLoaded:false
    }
  }),
  on(collectibleActionTypes.clearCollectibleForEdit, (state, action) => {
   
    return {...state,
      selectedCollectibleForEdit:null,
      selectedCollectibleForEditLoaded:false
    }
  }),

  

);


