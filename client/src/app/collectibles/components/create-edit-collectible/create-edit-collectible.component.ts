import { AppState } from '../../../store/reducers/index';
import { select, Store } from '@ngrx/store';
import { Attribute, Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import {
	createCollectible,
	updateCollectible,
} from '../../store/collectible.actions';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { Collectible } from '../../model/collectible.model';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { selectedCollectibleForEdit } from '../../store/collectible.selectors';
import { selectQueryParam, selectRouteParam } from 'src/app/router.selectors';
import { tap } from 'rxjs/operators';
import { Owner } from 'src/app/owners/model/owner.model';
import { loggedInOwner } from 'src/app/owners/store/owner.selectors';
interface FormField {
	id: number;
	name: {
		value: any;
		type: string;
		disable: boolean;
		visible: boolean;
		placeholder: string;
	};
	value: {
		value: any;
		type: string;
		disable: boolean;
		visible: boolean;
		placeholder: string;
	};
}
@Component({
	selector: 'app-create-edit-collectible',
	templateUrl: './create-edit-collectible.component.html',
	styleUrls: ['./create-edit-collectible.component.scss'],
})
export class CreateEditCollectibleComponent implements OnInit {
	collectible: Collectible = {} as Collectible;
	collectible$: Observable<Collectible>;
	profilePhotoUploader: FileUploader;
	profilePhotoImages = [];
	loggedInOwner: Owner;
	rootUrl = environment.production
		? 'https://omnifans.net'
		: 'http://localhost:3001';
	route = this.rootUrl + '/api/v1/files';
	type: string;

	public extraPropertyFields: {
		formFields: FormField[];
	};
	constructor(private store: Store<AppState>) {}

	ngOnInit() {
		this.store.select(loggedInOwner).subscribe((loggedInOwner) => {
			this.loggedInOwner = loggedInOwner;
		});
		this.store.pipe(select(selectQueryParam('type'))).subscribe((type) => {
			this.type = type;
		});
		this.collectible$ = this.store.select(selectedCollectibleForEdit);

		this.collectible$.subscribe((collectible) => {
			if (collectible) {
				this.collectible = _.cloneDeep(collectible);
			} else {
				this.collectible = {} as Collectible;
				this.extraPropertyFields = {
					formFields: [],
				};
				this.collectible.extraProperties = [];
				this.addExtraProperty();
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
		this.collectible?.profile_photos?.forEach((value) => {
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
		let collectible = {
			...this.collectible,
			...form.value,
			...{ type: this.type },
		};
		if (this.collectible._id) {
			this.store.dispatch(updateCollectible({ collectible }));
		} else {
			collectible.owner = this.loggedInOwner._id;
			this.store.dispatch(createCollectible({ collectible }));
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
		let updatedCollectible =
			arrayName == 'profile_photos'
				? {
						...{
							[arrayName]: [data.filename],
						},
				  }
				: {
						...{
							[arrayName]: this.collectible[arrayName]
								? [...this.collectible[arrayName], data.filename]
								: [data.filename],
						},
				  };
		this.collectible = { ...this.collectible, ...updatedCollectible };
		let navigationFalse = true;
		if (this.collectible && this.collectible._id) {
			this.store.dispatch(
				updateCollectible({ collectible: this.collectible, navigationFalse })
			);
		}
	}
	deleteImage(array, index) {
		let imagesArray = this.collectible[array];
		imagesArray.splice(index, 1);
		let collectible = {
			...this.collectible,
			...{
				[array]: [...imagesArray],
			},
		};
		this.collectible = collectible;
		if (this.collectible && this.collectible._id) {
			this.store.dispatch(updateCollectible({ collectible }));
		}
	}
	deleteExtraProperty(index: number) {
		this.extraPropertyFields.formFields.splice(index, 1);
	}
	addExtraProperty() {
		this.extraPropertyFields.formFields.push({
			id: Date.now(),
			name: {
				value: '',
				type: 'any',
				disable: false,
				visible: true,
				placeholder: '',
			},
			value: {
				value: '',
				type: 'any',
				disable: false,
				visible: true,
				placeholder: '',
			},
		});
		this.collectible.extraProperties.push({ name: '', value: '' });
	}
	trackNewExtraCollectible(item, index: number) {
		return index;
	}
	public removeExtraProperty(index: number): void {
		this.extraPropertyFields.formFields.splice(index, 1);
	}
}
