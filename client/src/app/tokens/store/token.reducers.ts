import { Token } from '../model/token.model';
import { EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { tokenActionTypes } from './token.actions';

export interface TokenState extends EntityState<Token> {
  tokensLoaded: boolean;
  tokens:Token[];
  selectedTokenForEdit:Token,
  selectedTokenForEditLoaded:boolean,
  ownerToken:Token,
  ownerTokenLoaded:boolean
}


export const initialState = {
  tokensLoaded: false,
  tokens:[],
  selectedTokenForEdit:null,
  selectedTokenForEditLoaded:false,
  ownerToken:null,
  ownerTokenLoaded:false

};

export const tokenReducer = createReducer(
  initialState,
  on(tokenActionTypes.tokensLoaded, (state, action) => {

    return {
      ...state,
      tokens:action.tokens,
      tokensLoaded:true
    };
  }),
  on(tokenActionTypes.unloadSelectedTokenForEdit, (state, action) => {

    return {
      ...state,
      selectedTokenForEdit:null,
      selectedTokenForEditLoaded:false
    };
  }),

  on(tokenActionTypes.getSelectedTokenForEditLoaded, (state, action) => {

    return {
      ...state,
      selectedTokenForEdit:action.token,
      selectedTokenForEditLoaded:true
    };
  }),
  on(tokenActionTypes.updateToken, (state, action) => {

    return {
      ...state,
      selectedTokenForEdit:action.token,
      selectedTokenForEditLoaded:true
    };
  }),

  on(tokenActionTypes.ownerTokenLoaded, (state, action) => {

    return {
      ...state,
      ownerToken:(action.tokens.length?action.tokens[0]:null),
      ownerTokenLoaded:true
    };
  }),

  on(tokenActionTypes.clearOwnerToken, (state, action) => {
    return {...state,
      ownerToken:null,
      ownerTokenLoaded:false
    }
  }),
  on(tokenActionTypes.clearSelectedTokenForEdit, (state, action) => {
    return {...state,
      selectedTokenForEdit:null,
      selectedTokenForEditLoaded:false
    }
  }),

  


  on(tokenActionTypes.clearTokens, (state, action) => {
    return {...state,
      tokens:[],
      tokensLoaded:false
    }
  }),

);


