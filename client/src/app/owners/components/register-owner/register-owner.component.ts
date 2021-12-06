import { Owner } from '../../model/owner.model';
import { registerOwner } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Attribute, Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';

@Component({
	selector: 'app-register-owner',
	templateUrl: './register-owner.component.html',
	styleUrls: ['./register-owner.component.scss'],
})
export class RegisterOwnerComponent implements OnInit {
	constructor(private store: Store<AppState>) {}

	ngOnInit() {}

	register(form) {
		if (form.invalid) {
			return;
		}
		let owner = form.value;
		this.store.dispatch(registerOwner({ owner }));
	}
}
