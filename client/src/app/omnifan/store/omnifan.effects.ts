import { omniFanActionTypes } from './omnifan.actions';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { OmniFansService } from '../services/omnifan.service';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/toasts/toast.service';
import { of } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable()
export class OmniFansEffects {


  ownerAccountBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(omniFanActionTypes.getOwnerAccountBalance),
      concatMap(() => this.omniFanService.getAccount()),
      concatMap((account:string) => this.omniFanService.getOwnerBalance(account)),
      map(ownerAccountBalance => omniFanActionTypes.ownerAccountBalanceLoaded
            ({ownerAccountBalance})
        )

    )
  );

  initWeb3$ = createEffect(() =>
    this.actions$.pipe(
      ofType(omniFanActionTypes.initWeb3),
      exhaustMap(() => this.omniFanService.initNetwork().pipe(
        map(() => {
          return omniFanActionTypes.web3Initiaized();
        }),
        catchError(error =>of(omniFanActionTypes.web3InitializationFailed()) )
      ))
    )
  );

  web3Initiaized$= createEffect(()=>
    this.actions$.pipe(
      ofType(omniFanActionTypes.web3Initiaized),
      map((res)=>{

        return omniFanActionTypes.setWeb3Initiaized();
      }


      )
    )
  );
  setWeb3Initiaized$= createEffect(()=>
    this.actions$.pipe(
      ofType(omniFanActionTypes.setWeb3Initiaized),
      tap((res)=>{
        this.storage.set('WEB3',true);
      })
    ),{dispatch:false}
  );
  getIsWeb3Initialized$= createEffect(()=>
    this.actions$.pipe(
      ofType(omniFanActionTypes.getIsWeb3Initialized),
      map((res)=>{
        if(this.storage.get('WEB3')){
          return omniFanActionTypes.initWeb3();
        }else{
          return omniFanActionTypes.emptyAction();
        }
      })
    )
  );



  web3InitializationFailed$= createEffect(()=>
    this.actions$.pipe(
      ofType(omniFanActionTypes.web3InitializationFailed),
      tap((res)=>{
        this.storage.set('WEB3',false);
          this.toastService.warning("Failed to Initialize Metamask");
      })
    ),{dispatch:false}
);




  constructor(
    private omniFanService: OmniFansService,
    private actions$: Actions,
    private router: Router,
    private toastService:ToastService,
    @Inject(SESSION_STORAGE) private storage : StorageService
    ) {}
}
