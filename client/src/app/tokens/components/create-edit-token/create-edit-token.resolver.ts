import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { filter, finalize, first, tap } from "rxjs/operators";
import { selectRouteParam } from "src/app/router.selectors";
import { clearSelectedTokenForEdit, getSelectedTokenForEdit, tokenActionTypes } from "../../store/token.actions";
import { AppState } from "src/app/store/reducers";

@Injectable()
export class CreateEditTokenResolver implements Resolve<Observable<any>> {
  constructor(private store: Store<AppState>) {}

  resolve(
  ): Observable<any> {
    return this.store.pipe(
      select(selectRouteParam('id')),
      tap((id) => {
        if (id) {
          this.store.dispatch(getSelectedTokenForEdit({id}));
        }else{
          
            this.store.dispatch(clearSelectedTokenForEdit())
          
        }
      }),
      first()
    );
  }
}
