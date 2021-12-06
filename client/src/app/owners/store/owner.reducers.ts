import { Owner } from '../model/owner.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ownerActionTypes, ownersLoaded } from './owner.actions';

export interface OwnerState extends EntityState<Owner> {
  ownersLoaded: boolean;
  loginSuccess: boolean;
  loggedInOwner: Owner;
  owners:any;
}

export const adapter: EntityAdapter<Owner> = createEntityAdapter<Owner>();

export const initialState = {
  ownersLoaded: false,
  loginSuccess:false,
  loggedInOwner:{}
};

export const ownerReducer = createReducer(
  initialState,

  /* on(ownerActionTypes.ownersLoaded, (state, action) => {
    return adapter.addMany(
      action.owners,
      {...state, ownersLoaded: true}
    );
  }),

  on(ownerActionTypes.createOwner, (state, action) => {
    return adapter.addOne(action.owner, state);
  }),

  on(ownerActionTypes.deleteOwner, (state, action) => {
    return adapter.removeOne(action.ownerId, state);
  }),

  on(ownerActionTypes.updateOwner, (state, action) => {
    return adapter.updateOne(action.update, state);
  }), */

  on(ownerActionTypes.setLoginOwnerSuccess, (state, action) => {
    return {...state,
      ...{
        loggedInOwner:action,
      loginSuccess:true
    }
    };
  }),
  on(ownerActionTypes.logoutOwnerSuccess, (state, action) => {
    return {...state,
      ...{
        loginSuccess:false,
      loggedInOwner:null}
    }
  }),
  on(ownerActionTypes.loggedInOwnerDetailsLoaded, (state, action) => {
    return action.owners.length?{
      ...state,
      ...{loggedInOwner:{...state.loggedInOwner,...action.owners[0]}}
    }:state
  }),
  on(ownerActionTypes.updateOwnerProfileSuccess, (state, action) => {
    return {
      ...state,
      ...{loggedInOwner:action.owner}
    }
  })


);

export const { selectAll, selectIds } = adapter.getSelectors();
