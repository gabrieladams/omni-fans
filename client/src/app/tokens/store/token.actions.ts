import { Token } from '../model/token.model';
import { createAction, props } from '@ngrx/store';

export const getTokens = createAction(
  '[Tokens] Get getTokens via Service'
);

export const clearTokens = createAction(
  '[Tokens] clearTokens via Service'
);

export const clearOwnerToken = createAction(
  '[Tokens] clearOwnerToken via Service'
);

export const clearSelectedTokenForEdit = createAction(
  '[Tokens] clearSelectedTokenForEdit via Service'
);





export const getOwnerToken = createAction(
  '[Tokens] Get getOwnerToken via Service',
  props<{owner:string}>()
);
export const ownerTokenLoaded = createAction(
  '[Tokens] ownerTokenLoaded via Service',
  props<{tokens:Token[]}>()
);
export const getOwnerTokenFailed = createAction(
  '[Tokens] getOwnerTokenFailed via Service',
  props<{error:any}>()
);

export const tokensLoaded = createAction(
  '[Tokens] Tokens Loaded via Service',
  props<{tokens:Token[]}>()
);


export const tokensFailedToLoad = createAction(
  '[Tokens] tokensFailedToLoad Fail via Service',
  props<{error:any}>()
);

export const createToken = createAction(
  '[Tokens] createToken Loaded via Service',
  props<{token:Token}>()
);
export const tokenCreated = createAction(
  '[Tokens] Token Created via Service',
  props<{token:Token}>()
);

export const tokenFailedToCreate = createAction(
  '[Tokens] tokenFailedToCreate via Service',
  props<{error:any}>()
);

export const getSelectedTokenForEdit = createAction(
  '[OmniPoools] getSelectedTokenForEdit via Service',
  props<{id:string}>()
);

export const getSelectedTokenForEditLoaded = createAction(
  '[Tokens] getSelectedTokenForEditLoaded via Service',
  props<{token:Token}>()
);


export const getSelectedTokenForEditFailed = createAction(
  '[Tokens] getSelectedTokenForEditFailed Fail via Service',
  props<{error:any}>()
);

export const unloadSelectedTokenForEdit=createAction('[Tokens] unloadSelectedTokenForEdit via Store')
export const updateToken = createAction(
  '[OmniPoools] updateToken via Service',
  props<{token:Token,navigationFalse?:boolean}>()
);

export const updateTokenSuccess = createAction(
  '[Tokens] updateTokenSuccess via Service',
  props<{token:Token}>()
);


export const updateTokenFailed = createAction(
  '[Tokens] updateTokenFailed Fail via Service',
  props<{error:any}>()
);








export const tokenActionTypes = {
  getTokens,
  tokensLoaded,
  clearTokens,
  createToken,
  tokensFailedToLoad,
  tokenCreated,
  tokenFailedToCreate,
  getSelectedTokenForEdit,
  getSelectedTokenForEditLoaded,
  getSelectedTokenForEditFailed,
  unloadSelectedTokenForEdit,
  updateToken,
  updateTokenFailed,
  updateTokenSuccess,
  getOwnerToken,
  getOwnerTokenFailed,
  ownerTokenLoaded,
clearOwnerToken,
clearSelectedTokenForEdit
};
