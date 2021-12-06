import { Owner } from '../../model/owner.model';
import {
	loadLoggedInOwnerDetails,
	registerOwner,
	updateOwnerProfile,
} from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Attribute, Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { loggedInOwner } from '../../store/owner.selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from 'src/app/toasts/toast.service';
import * as _ from 'lodash';
import * as Persona from 'persona';
import { Client } from 'persona';
import { environment } from 'src/environments/environment';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
	selector: 'app-owner-profile',
	templateUrl: './owner-profile.component.html',
	styleUrls: ['./owner-profile.component.scss'],
})
export class OwnerProfileComponent implements OnInit {
	owner$: Observable<Owner>;
	owner: Owner;
	profilePhotoUploader: FileUploader;
	profilePhotoImages = [];
	rootUrl = environment.production
		? 'https://omnifans.net'
		: 'http://localhost:3001';
	route = this.rootUrl + '/api/v1/files';
	constructor(
		private store: Store<AppState>,
		private toastService: ToastService
	) {}

	ngOnInit() {
		this.store.dispatch(loadLoggedInOwnerDetails());
		this.owner$ = this.store.select(loggedInOwner);
		this.owner$.subscribe((owner) => {
			this.owner = _.cloneDeep(owner);
			this.generateImageGallery();
		});
		this.profilePhotoUploader = new FileUploader({
			url: this.route,
			autoUpload: true,
		});

		this.profilePhotoUploader.onErrorItem = (item, response, status, headers) =>
			this.onErrorItem(item, response, status, headers);
		this.profilePhotoUploader.onSuccessItem = (
			item,
			response,
			status,
			headers
		) => this.onSuccessItem(item, response, status, headers, 'profile_photos');
	}
	generateImageGallery() {
		this.profilePhotoImages = [];
		this.owner?.profile_photos?.forEach((value) => {
			this.profilePhotoImages.push({
				src: this.rootUrl + '/' + value,
				thumb: this.rootUrl + '/' + value,
			});
		});
	}
	updateProfile(form) {
		if (form.invalid) {
			this.toastService.warning('Please fill all required fields');
			return;
		}
		let owner = this.owner;
		this.store.dispatch(updateOwnerProfile({ owner }));
	}

	verifyOwner() {
		console.log(this.owner);
		const client: Client = new Persona.Client({
			// This refers to a production demo template owned by Persona
			templateId: 'tmpl_Pa9T5SJoGF9f1pTeBF9aBkp7',
			environment: 'sandbox',
			onLoad: () => client.open(),
			onStart: (inquiryId: string) => console.log(inquiryId),
			onComplete: (inquiryId: string, scopes: { [key: string]: string }) => {
				console.log(inquiryId, scopes);
			},
			prefill: {
				nameFirst: this.owner.first_name,
				nameLast: this.owner.last_name,
				emailAddress: this.owner.email,
			},
		});
	}
	onErrorItem(
		item: FileItem,
		response: string,
		status: number,
		headers: ParsedResponseHeaders
	): any {
		let error = JSON.parse(response);
	}
	onSuccessItem(
		item: FileItem,
		response: string,
		status: number,
		headers: ParsedResponseHeaders,
		arrayName: string
	): any {
		let data = JSON.parse(response);
		let updatedOmniFans =
			arrayName == 'profile_photos'
				? {
						...{
							[arrayName]: [data.filename],
						},
				  }
				: {
						...{
							[arrayName]: this.owner[arrayName]
								? [...this.owner[arrayName], data.filename]
								: [data.filename],
						},
				  };
		this.owner = { ...this.owner, ...updatedOmniFans };
		let navigationFalse = true;
		if (this.owner && this.owner._id) {
			this.store.dispatch(
				updateOwnerProfile({ owner: this.owner, navigationFalse })
			);
		}
	}
	deleteImage(array, index) {
		let imagesArray = this.owner[array];
		imagesArray.splice(index, 1);
		let owner = {
			...this.owner,
			...{
				[array]: [...imagesArray],
			},
		};
		this.owner = owner;
		if (this.owner && this.owner._id) {
			this.store.dispatch(updateOwnerProfile({ owner }));
		}
	}
}
