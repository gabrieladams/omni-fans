import {
  loginOwner,
  loginOwnerSuccess,
  loginOwnerWithMetamask,
} from "../../store/owner.actions";
import { AppState } from "../../../store/reducers/index";
import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import { OmniFans } from "src/app/omnifan/model/omni.fan.model";
import {
  isOwnerAccountBalanceLoaded,
  ownerAccountBalance,
} from "src/app/omnifan/store/omnifan.selectors";
import { ToastService } from "src/app/toasts/toast.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { isOwnerLoggedIn } from "../../store/owner.selectors";
import { RegisterOwnerModalComponent } from "../register-owner-modal/register-owner-modal.componet";

@Component({
  selector: "app-login-owner-modal",
  templateUrl: "./login-owner-modal.component.html",
  styleUrls: ["./login-owner-modal.component.scss"],
})
export class LoginOwnerModalComponent implements OnInit {
  private ownerAccountBalance: OmniFans;
  private isOwnerAccountBalanceLoaded: boolean;

  constructor(
    private store: Store<AppState>,
    private toastService: ToastService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.store.select(ownerAccountBalance).subscribe((ownerAccountBalance) => {
      this.ownerAccountBalance = ownerAccountBalance;
    });
    this.store
      .select(isOwnerAccountBalanceLoaded)
      .subscribe((isOwnerAccountBalanceLoaded) => {
        this.isOwnerAccountBalanceLoaded = isOwnerAccountBalanceLoaded;
      });
  }

  loginIdentifierPassword(form) {
    if (form.invalid) {
      return;
    }
    let owner = form.value;

    this.store.dispatch(loginOwner({ owner, isModal: true }));
    this.store.select(isOwnerLoggedIn).subscribe((isOwnerLoggedIn) => {
      if (isOwnerLoggedIn) {
        this.activeModal.close();
      }
    });
  }
  loginWithMetamask() {
    if (this.isOwnerAccountBalanceLoaded) {
      this.store.dispatch(
        loginOwnerWithMetamask({ address: this.ownerAccountBalance.account })
      );
    } else {
      this.toastService.warning("Please select a metamask account");
    }
  }
  registerOwner() {
    const modalInstance = this.modalService.open(RegisterOwnerModalComponent);
  }
}
