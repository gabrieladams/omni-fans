import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { isOwnerLoggedIn } from "../owners/store/owner.selectors";
import { AppState } from "../store/reducers";

@Injectable()
export class LoginActivate implements CanActivate {
    isOwnerLoggedIn:boolean;
  constructor(private store: Store<AppState>, private router: Router) {
      this.store.select(isOwnerLoggedIn).subscribe((isOwnerLoggedIn)=>{
          this.isOwnerLoggedIn=isOwnerLoggedIn;
      })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!isOwnerLoggedIn) {
      this.router.navigate(['login']);
    }
    return true;
  }
}