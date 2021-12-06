import { Owner } from '../../model/owner.model';
import { registerOwner, registerOwnerWithMetamask } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/toasts/toast.service';
import { isOwnerAccountBalanceLoaded, ownerAccountBalance } from 'src/app/omnifan/store/omnifan.selectors';
import { OmniFans } from 'src/app/omnifan/model/omni.fan.model';
import { ownerAccountBalanceLoaded } from 'src/app/omnifan/store/omnifan.actions';

@Component({
  selector: 'app-register-owner-metamask',
  templateUrl: './register-owner-metamask.component.html'
})
export class RegisterOwnerMetamaskComponent implements OnInit {
  private ownerAccountBalance:OmniFans;
  private isOwnerAccountBalanceLoaded:boolean;
  constructor(
    private store: Store<AppState>,
    private toastService:ToastService) { }

  ngOnInit() {
    this.store.select(ownerAccountBalance).subscribe((ownerAccountBalance)=>{
      this.ownerAccountBalance=ownerAccountBalance;
    });
    this.store.select(isOwnerAccountBalanceLoaded).subscribe((isOwnerAccountBalanceLoaded)=>{
      this.isOwnerAccountBalanceLoaded=isOwnerAccountBalanceLoaded;
    });

  }

  register(form) {
    if (!this.isOwnerAccountBalanceLoaded) {
      this.toastService.warning("Please select a metamask account first");
      return;
    }
    if (form.invalid) {
      this.toastService.warning("Please fill all required fields");
      return;
    }
    let owner=form.value;
    owner.address=this.ownerAccountBalance.account;
    this.store.dispatch(registerOwnerWithMetamask({owner}));

  }

}
