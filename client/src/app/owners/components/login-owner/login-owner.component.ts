import { loginOwner, loginOwnerWithMetamask } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { OmniFans } from 'src/app/omnifan/model/omni.fan.model';
import {
	isOwnerAccountBalanceLoaded,
	ownerAccountBalance,
} from 'src/app/omnifan/store/omnifan.selectors';
import { ToastService } from 'src/app/toasts/toast.service';
// import { metaMaskIcon } from "../../../../assets/images/metamask.png";

@Component({
	selector: 'app-login-owner',
	templateUrl: './login-owner.component.html',
	styleUrls: ['./login-owner.component.scss'],
})
export class LoginOwnerComponent implements OnInit {
	private ownerAccountBalance: OmniFans;
	private isOwnerAccountBalanceLoaded: boolean;

	constructor(
		private store: Store<AppState>,
		private toastService: ToastService
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

		this.store.dispatch(loginOwner({ owner }));
	}
	loginWithMetamask() {
		if (this.isOwnerAccountBalanceLoaded) {
			this.store.dispatch(
				loginOwnerWithMetamask({ address: this.ownerAccountBalance.account })
			);
		} else {
			this.toastService.warning('Please select a metamask account');
		}
	}
}
