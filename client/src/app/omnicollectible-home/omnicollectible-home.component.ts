import { Store } from "@ngrx/store";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { OmniFans } from "src/app/omnifan/model/omni.fan.model";
import {
  isOwnerAccountBalanceLoaded,
  isWeb3Initialized,
  ownerAccountBalance,
} from "src/app/omnifan/store/omnifan.selectors";
import { ToastService } from "src/app/toasts/toast.service";
import { AppState } from "../store/reducers";
import { isOwnerLoggedIn, loggedInOwner } from "../owners/store/owner.selectors";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { LoginOwnerModalComponent } from "../owners/components/login-owner-modal/login-owner-modal.component";
import { Owner } from "../owners/model/owner.model";
import { initWeb3 } from "../omnifan/store/omnifan.actions";
import { OmniFansService } from "../omnifan/services/omnifan.service";
import { BehaviorSubject } from "rxjs";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { Router } from "@angular/router";

@Component({
  selector: "app-omnicollectible-home",
  templateUrl: "./omnicollectible-home.component.html",
  styleUrls: ["./omnicollectible-home.component.scss"],
})
export class OmniCollectibleHomeComponent implements OnInit {
  modalInstance: NgbModalRef;
  constructor(
    private store: Store<AppState>,
    private toastService: ToastService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  loggedInOwner: Owner;
  isWeb3Initialized: boolean;
  ownerAccountBalance: OmniFans;
  ngOnInit() {
    this.store.select(loggedInOwner).subscribe((loggedInOwner) => {
      this.loggedInOwner = loggedInOwner;
    });
    this.store.select(isWeb3Initialized).subscribe((isWeb3Initialized) => {
      this.isWeb3Initialized = isWeb3Initialized;
    });
    this.store.select(ownerAccountBalance).subscribe((ownerAccountBalance) => {
      this.ownerAccountBalance = ownerAccountBalance;
    });
  }

  addToCollectible() {
    if (this.loggedInOwner && this.loggedInOwner.ownername) {
      this.router.navigate(["/omnicollectible-add"]);
    } else {
      this.modalInstance = this.modalService.open(LoginOwnerModalComponent);
      this.modalInstance.componentInstance.isOpen = true;
      this.modalInstance.result
        .then(() => {
          if (this.loggedInOwner && this.loggedInOwner.ownername) {
            this.addToCollectible();
          }
        })
        .catch((res) => {});
    }
  }
  connectWallet() {
    this.store.dispatch(initWeb3());
  }
}
