import { ownerActionTypes, ownersLoaded, updateOwner } from './owner.actions';
import { OwnerService } from '../services/owner.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, flatMap, map, take, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {SESSION_STORAGE, StorageService} from 'ngx-webstorage-service';
import { Owner, OwnerLoginResponse } from '../model/owner.model';
import { of, throwError } from 'rxjs';
import { ToastService } from 'src/app/toasts/toast.service';
import { loggedInOwner } from './owner.selectors';
import { AppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { tokenActionTypes } from 'src/app/tokens/store/token.actions';

@Injectable()
export class OwnerEffects {

  loadOwners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ownerActionTypes.loadOwners),
      concatMap(() => this.ownerService.getAllOwners()),
      map(owners => ownerActionTypes.ownersLoaded({owners}))
    )
  );
  loadLoggedInOwnerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ownerActionTypes.loadLoggedInOwnerDetails),
      exhaustMap(()=>this.store.select(loggedInOwner)),
      take(1),
      concatMap((owner) => this.ownerService.getOwnerByEmail(owner.email)),
      map(owners => ownerActionTypes.loggedInOwnerDetailsLoaded({owners}))
    )
  );

  createOwner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ownerActionTypes.createOwner),
      concatMap((action) => this.ownerService.createOwner(action.owner)),
      tap(() => this.router.navigateByUrl('/owners'))
    ),
    {dispatch: false}
  );

  deleteOwner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ownerActionTypes.deleteOwner),
      concatMap((action) => this.ownerService.deleteOwner(action.ownerId))
    ),
    {dispatch: false}
  );

  updateOwner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ownerActionTypes.updateOwner),
      concatMap((action) => this.ownerService.updateOwner(action.update.id, action.update.changes))
    ),
    {dispatch: false}
  );


  getLoggedInOwner$=createEffect(()=>
  this.actions$.pipe(
    ofType(ownerActionTypes.getLoggedInOwner),
    map(()=>{
      const owner:Owner=this.storage.get('USER');
      if(owner&&owner.ownername){
        return ownerActionTypes.setLoginOwnerSuccess(owner);
      }else{
        return ownerActionTypes.loginOwnerFailed({error:{}});
      }

    }
    )
  )
)
/* Auth Functions*/

login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ownerActionTypes.loginOwner),
     exhaustMap((action) =>
      this.ownerService.login(action.owner).pipe(
        map(ownerLoginResponse => ownerActionTypes.loginOwnerSuccess({ownerLoginResponse,isModal:action.isModal})),
        catchError(error => of(ownerActionTypes.loginOwnerFailed({ error })))
      )
    )
  )
);

loginOwnerWithMetamask$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ownerActionTypes.loginOwnerWithMetamask),
    concatMap((action)=>this.ownerService.getOwnerByPublicAddress(action.address)),
    concatMap((owner)=>this.ownerService.signOwnerNonce(owner)),
    exhaustMap((owner) =>
      this.ownerService.login(owner).pipe(

        map(ownerLoginResponse => ownerActionTypes.loginOwnerSuccess({ ownerLoginResponse })),
        catchError(error => {
          ownerActionTypes.loginOwnerFailed({ error })
          return throwError(error);
        })
      )
    )
  )
);

loginFailed$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.loginOwnerFailed),
      tap((res)=>{
          res?.error?.error?.error?this.toastService.warning(res?.error?.error?.error):'';
      })
    ),{dispatch:false}
);

loginRedirect$=createEffect(()=>
        this.actions$.pipe(
          ofType(ownerActionTypes.loginPageRedirect),
          tap(authed=>{
            return this.router.navigate(['/login-owner']);
          })
        ),{dispatch:false}
  );

  dashboardPageRedirect$=createEffect(()=>
        this.actions$.pipe(
          ofType(ownerActionTypes.dashboardPageRedirect),
          tap(({navigationFalse})=>{
            if(!navigationFalse){
              return this.router.navigate(['/']);
            }
          })
        ),{dispatch:false}
  );


  logout$=createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.logoutOwner),
      map(()=>{
        this.storage.set('TOKEN','');
        this.storage.set('USER','');
          this.router.navigate(['/']);
          tokenActionTypes.clearOwnerToken();
          
          return ownerActionTypes.logoutOwnerSuccess()
      })
    )
  );

  /*Register Functions*/
register$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ownerActionTypes.registerOwner),
     exhaustMap((action) =>{
      return this.ownerService.register(action.owner).pipe(
        map(owner => ownerActionTypes.registerOwnerSuccess(action)),
        catchError(error => of(ownerActionTypes.registerOwnerFailed({ error })))
      )
     }

    )
  )
);
updateOwnerProfile$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ownerActionTypes.updateOwnerProfile),
    exhaustMap(({owner,navigationFalse}) =>{
      return this.ownerService.updateOwnerProfile(owner).pipe(
        map(owner => {
          return ownerActionTypes.updateOwnerProfileSuccess({ owner,navigationFalse })
        }),
        catchError(error => of(ownerActionTypes.updateOwnerProfileFailed({ error })))
      )
     }

    )
  )
);
updateOwnerProfileSuccess$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.updateOwnerProfileSuccess),
      map(({owner,navigationFalse})=>{
        this.toastService.success("Your profile has been updated.");
        return ownerActionTypes.dashboardPageRedirect({navigationFalse});
      })
    )
);

updateOwnerProfileFailed$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.updateOwnerProfileFailed),
      map((error)=>{
        this.toastService.success("Failed to update profile");
      })
    ),{dispatch:false}
);
registerOwnerWithMetamask$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ownerActionTypes.registerOwnerWithMetamask),

     exhaustMap((action) =>{
      return this.ownerService.register(action.owner).pipe(
        map(owner => ownerActionTypes.registerWithMetamaskOwnerSuccess(action)),
        catchError(error => of(ownerActionTypes.registerOwnerFailed({ error })))
      )
     }

    )
  )
);
registerWithMetamaskSuccess$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.registerWithMetamaskOwnerSuccess),
      map((action)=>{
        let {address}=action.owner;
        if(!action.isModal){
          this.toastService.success("Your account has been created, redirecting to login");
          return ownerActionTypes.loginOwnerWithMetamask({address});
        }

      })
    )
);
registerSuccess$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.registerOwnerSuccess),
      map((action)=>{
        if(!action.isModal){
          this.toastService.success("Your account has been created, redirecting to login");
          return ownerActionTypes.loginPageRedirect();
        }
      })
    )
);

registerOwnerFailed$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.registerOwnerFailed),
      map((error)=>{
        this.toastService.success("Failed to create owner account, please try again");
      })
    ),{dispatch:false}
);
loginSuccess$= createEffect(()=>
    this.actions$.pipe(
      ofType(ownerActionTypes.loginOwnerSuccess),
      tap((res)=>{
        if(!res.isModal){
          this.router.navigate(['/tokens-list']);
        }
      }),
      map((res)=>ownerActionTypes.setLoggedInOwner(res.ownerLoginResponse)),

    )
);
setLoggedOwner$=createEffect(()=>
      this.actions$.pipe(
        ofType(ownerActionTypes.setLoggedInOwner),
        map((ownerLoginResponse:OwnerLoginResponse)=>{
          this.storage.set('TOKEN',ownerLoginResponse.token);
          this.storage.set('USER',ownerLoginResponse.owner);
          let {owner}=ownerLoginResponse;
          this.toastService.success("Owner Logged In successfully");
          return ownerActionTypes.setLoginOwnerSuccess(owner);
        })
      )

  );

  constructor(
    private store:Store<AppState>,
    private ownerService: OwnerService,
    private actions$: Actions,
    private router: Router,
    private toastService:ToastService,
    @Inject(SESSION_STORAGE) private storage : StorageService
    ) {}
}
