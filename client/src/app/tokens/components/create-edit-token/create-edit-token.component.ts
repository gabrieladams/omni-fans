import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Attribute, Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { createToken, updateToken } from '../../store/token.actions';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { Token } from '../../model/token.model';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { selectedTokenForEdit } from '../../store/token.selectors';
import { selectRouteParam } from 'src/app/router.selectors';
import { Owner } from 'src/app/owners/model/owner.model';
import { loggedInOwner } from 'src/app/owners/store/owner.selectors';

@Component({
	selector: 'app-create-edit-token',
	templateUrl: './create-edit-token.component.html',
})
export class CreateEditTokenComponent implements OnInit {
	token: Token = {} as Token;
	token$: Observable<Token>;
	profilePhotoUploader: FileUploader;
	profilePhotoImages = [];
	rootUrl = environment.production
		? 'https://omnifans.net'
		: 'http://localhost:3001';
	route = this.rootUrl + '/api/v1/files';
	loggedInOwner: Owner;
	constructor(private store: Store<AppState>) {}

	ngOnInit() {
		this.store.select(loggedInOwner).subscribe((loggedInOwner) => {
			this.loggedInOwner = loggedInOwner;
		});
		this.token$ = this.store.select(selectedTokenForEdit);

		this.token$.subscribe((token) => {
			if (token) {
				this.token = _.cloneDeep(token);
			} else {
				this.token = {} as Token;
			}
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
		this.token?.profile_photos?.forEach((value) => {
			this.profilePhotoImages.push({
				src: this.rootUrl + '/' + value,
				thumb: this.rootUrl + '/' + value,
			});
		});
	}

	createUpdate(form) {
		if (form.invalid) {
			return;
		}
		let token = { ...this.token, ...form.value };
		if (this.token._id) {
			this.store.dispatch(updateToken({ token }));
		} else {
			token.owner = this.loggedInOwner._id;
			this.store.dispatch(createToken({ token }));
		}
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
		let updatedToken =
			arrayName == 'profile_photos'
				? {
						...{
							[arrayName]: [data.filename],
						},
				  }
				: {
						...{
							[arrayName]: this.token[arrayName]
								? [...this.token[arrayName], data.filename]
								: [data.filename],
						},
				  };
		this.token = { ...this.token, ...updatedToken };
		let navigationFalse = true;
		if (this.token && this.token._id) {
			this.store.dispatch(updateToken({ token: this.token, navigationFalse }));
		}
	}
	deleteImage(array, index) {
		let imagesArray = this.token[array];
		imagesArray.splice(index, 1);
		let token = {
			...this.token,
			...{
				[array]: [...imagesArray],
			},
		};
		this.token = token;
		if (this.token && this.token._id) {
			this.store.dispatch(updateToken({ token }));
		}
	}
}
