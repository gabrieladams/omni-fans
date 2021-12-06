import { collectibleActionTypes } from './collectible.actions';
import { CollectibleService } from '../services/collectible.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Collectible } from '../model/collectible.model';

@Injectable()
export class CollectibleEffects {

  getCollectibles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectibleActionTypes.getCollectibles),
      tap(()=>collectibleActionTypes.clearCollectibles()),
      exhaustMap(({conditions}) =>{
      
        return this.collectibleService.getCollectibles({conditions}).pipe(
          map(collectibles => collectibleActionTypes.collectiblesLoaded({collectibles})),
          catchError(error => of(collectibleActionTypes.collectiblesFailedToLoad({ error })))
        )
       }
      )
    )
  );
  createCollectible$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectibleActionTypes.createCollectible),
      map(action=>action.collectible),
      exhaustMap((collectible) =>{
        return this.collectibleService.createCollectible(collectible).pipe(
          map(collectible => {
            this.router.navigate(['/collectibles-list',collectible.owner]);
            return collectibleActionTypes.collectibleCreated({collectible})
          }),
          catchError(error => of(collectibleActionTypes.collectibleFailedToCreate({ error })))
        )
       }
      )
    )
  );
  getSelectedCollectibleForEdit$ = createEffect(() =>
  this.actions$.pipe(
    ofType(collectibleActionTypes.getSelectedCollectibleForEdit),
    map(action=>action.id),
    exhaustMap((id) =>{
      collectibleActionTypes.unloadSelectedCollectibleForEdit();
      return this.collectibleService.getCollectible(id).pipe(
        map(collectible => collectibleActionTypes.getSelectedCollectibleForEditLoaded({collectible})),
        catchError(error => of(collectibleActionTypes.getSelectedCollectibleForEditFailed({ error })))
      )
     }
    )
  )
);
updateCollectible$ = createEffect(() =>
  this.actions$.pipe(
    ofType(collectibleActionTypes.updateCollectible),
    exhaustMap(({collectible,navigationFalse}) =>{
      return this.collectibleService.updateCollectible(collectible).pipe(
        map(collectible => {
          if(!navigationFalse){
            this.router.navigate(['/collectibles-list',collectible.owner]);
          }
          return collectibleActionTypes.updateCollectibleSuccess({collectible})
        }),
        catchError(error => of(collectibleActionTypes.updateCollectibleFailed({ error })))
      )
     }
    )
  )
);
  constructor(private collectibleService: CollectibleService, private actions$: Actions, private router: Router) {}
}
