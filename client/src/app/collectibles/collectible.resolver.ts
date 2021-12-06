import { AppState } from "../store/reducers/index";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { filter, finalize, first, tap } from "rxjs/operators";
import { isCollectiblesLoaded } from "./store/collectible.selectors";
import { getCollectibles } from "./store/collectible.actions";
import { selectRouteParam, selectRouteParams } from "../router.selectors";

@Injectable()
export class CollectibleResolver implements Resolve<Observable<any>> {
  constructor(private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return combineLatest([
      this.store.select(selectRouteParam('owner')),
      this.store.select(isCollectiblesLoaded)]
    ).pipe(
      tap(([owner,isCollectiblesLoaded]) => {
        if (!isCollectiblesLoaded) {
          let conditions={owner};
          this.store.dispatch(getCollectibles({conditions}));
        }
      }),
    filter(([owner,isCollectiblesLoaded]) => isCollectiblesLoaded),
    first()
    )
  }
}
