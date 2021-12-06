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
import { clearCollectibleForEdit, getSelectedCollectibleForEdit } from "../../store/collectible.actions";
import { AppState } from "src/app/store/reducers";

@Injectable()
export class CreateEditCollectibleResolver implements Resolve<Observable<any>> {
  constructor(private store: Store<AppState>) {}

  resolve(
  ): Observable<any> {
    return this.store.pipe(
      select(selectRouteParam('id')),
      tap((id) => {
        if (id) {
          this.store.dispatch(getSelectedCollectibleForEdit({id}));
        }else{
          this.store.dispatch(clearCollectibleForEdit())
        }
      }),
      first()
    );
  }

  
}
