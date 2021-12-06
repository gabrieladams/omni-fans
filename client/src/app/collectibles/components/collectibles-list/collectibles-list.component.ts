import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { loggedInOwner } from 'src/app/owners/store/owner.selectors';
import { selectRouteParam } from 'src/app/router.selectors';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { Collectible } from '../../model/collectible.model';
import { getCollectibles } from '../../store/collectible.actions';
import { collectibles } from '../../store/collectible.selectors';
import { ViewCollectibleModalComponent } from '../view-collectible-modal/view-collectible-modal.component';

@Component({
	selector: 'app-collectibles',
	templateUrl: './collectibles-list.component.html',
	styleUrls: ['./collectibles-list.component.scss'],
})
export class CollectiblesListComponent implements OnInit {
	rootUrl = environment.production
		? 'https://omnifans.net'
		: 'http://localhost:3001';
	collectibles$: Observable<Collectible[]>;
	isOwner: boolean;
	constructor(private store: Store<AppState>, private modalService: NgbModal) {}
	ngOnInit() {
		this.collectibles$ = this.store.select(collectibles);
		this.store.select(selectRouteParam('owner')).subscribe((owner) => {});

		combineLatest([
			this.store.select(selectRouteParam('owner')),
			this.store.select(loggedInOwner),
		]).subscribe(([owner, ownerObj]) => {
			let conditions = { owner };
			this.store.dispatch(getCollectibles({ conditions }));
			this.isOwner = ownerObj._id == owner;
		});
	}

	viewCollectibleDetails(collectibleID: string) {
		const modalRef = this.modalService.open(ViewCollectibleModalComponent);
		modalRef.componentInstance.collectibleID = collectibleID;
	}
}
