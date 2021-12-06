import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import { OmniFans } from './omnifan/model/omni.fan.model';
import { ownerAccountBalance } from './omnifan/store/omnifan.selectors';
import { Owner } from './owners/model/owner.model';
import { isOwnerLoggedIn, loggedInOwner } from './owners/store/owner.selectors';
import { selectCurrentRoute, selectRouteData } from './router.selectors';
import { getLoggedInOwner } from './owners/store/owner.actions';
import { getIsWeb3Initialized } from './omnifan/store/omnifan.actions';
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "OmniFans";
  ownerAccountBalance: OmniFans;
  loggedInOwner: Owner;
  isOwnerLoggedIn: boolean;
  hideSideBar: boolean;
  home: boolean;
  constructor(private store: Store<AppState>,private router:Router) {}
  ngOnInit(): void {
    this.store.select(ownerAccountBalance).subscribe((ownerAccountBalance) => {
      this.ownerAccountBalance = ownerAccountBalance;
    });

    this.store.select(loggedInOwner).subscribe((loggedInOwner) => {
      this.loggedInOwner = loggedInOwner;
    });
    this.store.select(isOwnerLoggedIn).subscribe((isOwnerLoggedIn) => {
      this.isOwnerLoggedIn = isOwnerLoggedIn;
    });
    this.store.dispatch(getLoggedInOwner());
    this.store.dispatch(getIsWeb3Initialized());

    this.store.select(selectCurrentRoute).subscribe((currentRoute) => {
      let route = currentRoute?.routeConfig?.path;
      this.hideSideBar = [
        "register-owner",
        "register-owner-metamask",
        "login-owner",
      ].includes(route);
      this.home = route == "";
      if(route==""){
        if(this.isOwnerLoggedIn){
          this.router.navigate(['tokens-list']);
        }
      }
    });
  }
}
