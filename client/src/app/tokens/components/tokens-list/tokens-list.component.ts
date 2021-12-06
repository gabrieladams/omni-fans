import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getLoggedInOwner } from 'src/app/owners/store/owner.actions';
import {
	isOwnerLoggedIn,
	loggedInOwner,
} from 'src/app/owners/store/owner.selectors';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { Token } from '../../model/token.model';
import { getOwnerToken, getTokens } from '../../store/token.actions';
import { ownerToken, tokens } from '../../store/token.selectors';
import { ViewTokenModalComponent } from '../view-token-modal/view-token-modal.component';

@Component({
	selector: 'app-tokens',
	templateUrl: './tokens-list.component.html',
	styleUrls: ['./tokens-list.component.scss'],
})
export class TokensListComponent implements OnInit {
	rootUrl = environment.production
		? 'https://omnifans.net'
		: 'http://localhost:3001';
	tokens$: Observable<Token[]>;
	ownerToken: Token;
	constructor(private store: Store<AppState>, private modalService: NgbModal) {}
	ngOnInit() {
		this.tokens$ = this.store.select(tokens);
		this.store.dispatch(getTokens());
		this.store.select(loggedInOwner).subscribe((loggedInOwner) => {
			if (loggedInOwner && loggedInOwner._id) {
				this.store.dispatch(getOwnerToken({ owner: loggedInOwner._id }));
			}
		});

		this.store.select(ownerToken).subscribe((ownerToken) => {
			this.ownerToken = ownerToken;
		});
	}

	viewTokenDetails(tokenID: string) {
		const modalRef = this.modalService.open(ViewTokenModalComponent);
		modalRef.componentInstance.tokenID = tokenID;
	}
}
