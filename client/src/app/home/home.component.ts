import { Store } from "@ngrx/store";
import { Observable, timer } from "rxjs";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ownerAccountBalance } from "src/app/omnifan/store/omnifan.selectors";
import { AppState } from "../store/reducers";
import { isOwnerLoggedIn, loggedInOwner } from "../owners/store/owner.selectors";
import { Owner } from "../owners/model/owner.model";
import { getLoggedInOwner, logoutOwner } from "../owners/store/owner.actions";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isOwnerLoggedIn$: Observable<boolean>;
  loggedInOwner$: Observable<Owner>;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.isOwnerLoggedIn$ = this.store.select(isOwnerLoggedIn);
    this.loggedInOwner$ = this.store.select(loggedInOwner);
  }
  logout() {
    this.store.dispatch(logoutOwner());
  }
}
