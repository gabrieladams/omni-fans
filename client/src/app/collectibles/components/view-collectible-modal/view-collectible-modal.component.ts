import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { OmniFans } from 'src/app/omnifan/model/omni.fan.model';
import { ToastService } from 'src/app/toasts/toast.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { selectedCollectibleForEdit } from '../../store/collectible.selectors';
import { Observable } from 'rxjs';
import { Collectible } from '../../model/collectible.model';
import { getSelectedCollectibleForEdit } from '../../store/collectible.actions';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-view-collectible-modal',
	templateUrl: './view-collectible-modal.component.html',
})
export class ViewCollectibleModalComponent implements OnInit {
	collectible$: Observable<Collectible>;
	@Input() collectibleID: string;
	rootUrl = environment.production
		? 'https://omnifans.net'
		: 'http://localhost:3001';
	profilePhotoImages = [];
	constructor(
		private store: Store<AppState>,
		public activeModal: NgbActiveModal,
		private modalService: NgbModal
	) {}

	ngOnInit() {
		this.collectible$ = this.store.select(selectedCollectibleForEdit);
		this.store.dispatch(
			getSelectedCollectibleForEdit({ id: this.collectibleID })
		);

		this.collectible$.subscribe((collectible) => {
			this.profilePhotoImages = [];
			collectible?.profile_photos?.forEach((value) => {
				this.profilePhotoImages.push({
					src: this.rootUrl + '/' + value,
					thumb: this.rootUrl + '/' + value,
				});
			});
		});
	}
}
