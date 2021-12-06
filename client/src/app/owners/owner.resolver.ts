import { areOwnersLoaded } from "./store/owner.selectors";
import { loadOwners, ownersLoaded } from "./store/owner.actions";
import { AppState } from "../store/reducers/index";
import { Owner } from "./model/owner.model";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { filter, finalize, first, tap } from "rxjs/operators";

@Injectable()
export class OwnerResolver implements Resolve<Observable<any>> {
  constructor(private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.store.pipe(
      select(areOwnersLoaded),
      tap((ownersLoaded) => {
        if (!ownersLoaded) {
          this.store.dispatch(loadOwners());
        }
      }),
      filter((ownersLoaded) => ownersLoaded),
      first()
    );
  }
}
