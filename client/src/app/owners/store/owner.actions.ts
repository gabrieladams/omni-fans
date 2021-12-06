import { Owner, OwnerLoginObject, OwnerLoginResponse } from '../model/owner.model';
import { createAction, props } from '@ngrx/store';
import {Update} from '@ngrx/entity';


export const loadOwners = createAction(
  '[Owners List] Load Owners via Service',
);

export const ownersLoaded = createAction(
  '[Owners Effect] Owners Loaded Successfully',
  props<{owners: Owner[]}>()
);
export const loadLoggedInOwnerDetails = createAction(
  '[Owners Object] Load Owner via Service'
);

export const loggedInOwnerDetailsLoaded = createAction(
  '[Owners Effect] Owner Object Loaded Successfully',
  props<{owners: Owner[]}>()
);

export const createOwner = createAction(
  '[Create Owner Component] Create Owner',
  props<{owner: Owner}>()
);

export const updateOwnerProfile = createAction(
  '[Update Owner Profile Component] Update Owner Profile',
  props<{owner: Owner,navigationFalse?:boolean}>()
);

export const updateOwnerProfileSuccess = createAction(
  '[Owners Effect] Update Owner Profile Success',
  props<{owner: Owner,navigationFalse?:boolean}>()
);

export const updateOwnerProfileFailed = createAction(
  '[Update Owner Profile Failed] Update Owner Profile failed via Service',
  props<{error: any}>()
);

export const deleteOwner = createAction(
  '[Owners List Operations] Delete Owner',
  props<{ownerId: string}>()
);

export const updateOwner = createAction(
  '[Owners List Operations] Update Owner',
  props<{update: Update<Owner>}>()
);

export const signupOwner = createAction(
  '[Owners Sign UP] Sign UP Owners via Service',
);

export const signupOwnerSuccess = createAction(
  '[Owners Sign UP Success] Sign UP Owners Success via Service',
);

export const signupOwnerFailed = createAction(
  '[Owners Sign UP Failed] Sign UP Owners Failed via Service',
);

export const loginOwner = createAction(
  '[Owners LOGIN] LOGIN Owners via Service',
  props<{owner:Owner,isModal?:boolean}>()
);



export const registerOwner = createAction(
  '[Owners REGISTER] REGISTER Owners via Service',
  props<{owner: Owner,isModal?:boolean}>()
);

export const registerOwnerWithMetamask = createAction(
  '[Owners REGISTER with Metamask] REGISTER Owners with Metamask via Service',
  props<{owner: Owner,isModal?:boolean}>()
);



export const registerOwnerSuccess = createAction(
  '[Owners Registration Success] Register Owners Success via Service',
  props<{owner: Owner,isModal?:boolean}>()
);

export const registerWithMetamaskOwnerSuccess = createAction(
  '[Owners Registration with Metamask Success] Register Owners with Metamask Success via Service',
  props<{owner: Owner,isModal?:boolean}>()
);



export const registerOwnerFailed = createAction(
  '[Owners Registration Failed] Register Owners Failed via Service',
  props<{error: any}>()
);

export const loginOwnerSuccess = createAction(
  '[Owners LOGIN Success] LOGIN Owners Success via Service',
  props<{ownerLoginResponse: OwnerLoginResponse,isModal?:boolean}>()
);

export const setLoggedInOwner = createAction(
  '[Owners Set LOGIN Owner] Set LOGIN Owners DB Success via Service',
  props<OwnerLoginResponse>()
);

export const setLoginOwnerSuccess = createAction(
  '[Owners Set Login Owner Success] Set login owner Success via Service',
  props<Owner>()
);

export const loginOwnerWithMetamask = createAction(
  '[Owners LOGIN with Metamask] LOGIN Owners with Metamask via Service',
  props<{address:string}>()
);



export const loginOwnerFailed = createAction(
  '[Owners LOGIN Failed] LOGIN Owners Failed via Service',
  props<{error: any}>()
);

export const getLoggedInOwner = createAction(
  '[Owners Get Logged IN Owner] Get Logged In Owner via Service',
);

export const loginPageRedirect = createAction(
  '[Owners Get Logged IN Page Redirect] Logged In Owner Redirect via Service',
);

export const dashboardPageRedirect = createAction(
  '[Owners Get Dashboard Page Redirect] Dashboard Page Redirect via Service',
  props<{navigationFalse?: boolean}>()
);



export const logoutOwner = createAction(
  '[Owners Log Out Owner] Log out owner via Service',
);

export const logoutOwnerSuccess = createAction(
  '[Owners Log Out Owner Success] Log out owner Success via Service',
);

export const getLoggedInOwnerSuccess = createAction(
  '[Owners Get Logged IN Owner Success] Get Logged In Owner Success via Service',
  props<{owner: Owner}>()
);

export const ownerActionTypes = {
  signupOwner,
  signupOwnerSuccess,
  signupOwnerFailed,
  setLoggedInOwner,
  setLoginOwnerSuccess,
  registerOwner,
  registerOwnerWithMetamask,
  registerOwnerFailed,
  registerOwnerSuccess,
  registerWithMetamaskOwnerSuccess,
  logoutOwner,
  logoutOwnerSuccess,
  loginOwner,
  loginOwnerSuccess,
  loginOwnerFailed,
  loginOwnerWithMetamask,
  loginPageRedirect,
  getLoggedInOwner,
  getLoggedInOwnerSuccess,
  updateOwnerProfile,
  updateOwnerProfileFailed,
  updateOwnerProfileSuccess,
  loadLoggedInOwnerDetails,
  loggedInOwnerDetailsLoaded,
  ownersLoaded,
  loadOwners,
  createOwner,
  deleteOwner,
  updateOwner,
  dashboardPageRedirect
};
