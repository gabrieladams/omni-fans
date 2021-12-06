import { tokenActionTypes } from './token.actions';
import { TokenService } from '../services/token.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Token } from '../model/token.model';

@Injectable()
export class TokenEffects {

  getTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tokenActionTypes.getTokens),
      exhaustMap(() =>{
        return this.tokenService.getTokens().pipe(
          map(tokens => tokenActionTypes.tokensLoaded({tokens})),
          catchError(error => of(tokenActionTypes.tokensFailedToLoad({ error })))
        )
       }
      )
    )
  );
  createToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tokenActionTypes.createToken),
      map(action=>action.token),
      exhaustMap((token) =>{
        return this.tokenService.createToken(token).pipe(
          map(token => {
            this.router.navigate(['/tokens-list']);
            return tokenActionTypes.tokenCreated({token})
          }),
          catchError(error => of(tokenActionTypes.tokenFailedToCreate({ error })))
        )
       }
      )
    )
  );
  getSelectedTokenForEdit$ = createEffect(() =>
  this.actions$.pipe(
    ofType(tokenActionTypes.getSelectedTokenForEdit),
    map(action=>action.id),
    exhaustMap((id) =>{
      tokenActionTypes.unloadSelectedTokenForEdit();
      return this.tokenService.getToken(id).pipe(
        map(token => tokenActionTypes.getSelectedTokenForEditLoaded({token})),
        catchError(error => of(tokenActionTypes.getSelectedTokenForEditFailed({ error })))
      )
     }
    )
  )
);
updateToken$ = createEffect(() =>
  this.actions$.pipe(
    ofType(tokenActionTypes.updateToken),
    exhaustMap(({token,navigationFalse}) =>{
      return this.tokenService.updateToken(token).pipe(
        map(token => {
          if(!navigationFalse){
            this.router.navigate(['/tokens-list']);
          }
          return tokenActionTypes.updateTokenSuccess({token})
        }),
        catchError(error => of(tokenActionTypes.updateTokenFailed({ error })))
      )
     }
    )
  )
);
getOwnerToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tokenActionTypes.getOwnerToken),
      concatMap(({owner}) => this.tokenService.getOwnerToken(owner)),
      map(tokens => tokenActionTypes.ownerTokenLoaded({tokens})),
      catchError(error => of(tokenActionTypes.getOwnerTokenFailed({ error })))
    )
  );
  constructor(private tokenService: TokenService, private actions$: Actions, private router: Router) {}
}
