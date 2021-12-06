import { AppState } from "../store/reducers/index";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { filter, finalize, first, tap } from "rxjs/operators";
import { isTokensLoaded } from "./store/token.selectors";
import { getTokens } from "./store/token.actions";

@Injectable()
export class TokenResolver implements Resolve<Observable<any>> {
  constructor(private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.store.pipe(
      select(isTokensLoaded),
      tap((isTokensLoaded) => {
        if (!isTokensLoaded) {
          this.store.dispatch(getTokens());
        }
      }),
      filter((isTokensLoaded) => isTokensLoaded),
      first()
    );
  }
}
