import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { OmniFans } from '../omnifan/model/omni.fan.model';
import { AppState } from '../store/reducers';
import { Owner } from '../owners/model/owner.model';
import { logoutOwner } from '../owners/store/owner.actions';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
	@Input() ownerAccountBalance: OmniFans;
	@Input() isOwnerLoggedIn: boolean;
	@Input() loggedInOwner: Owner;

	constructor(private store: Store<AppState>) {}

	logout() {
		this.store.dispatch(logoutOwner());
	}
}
