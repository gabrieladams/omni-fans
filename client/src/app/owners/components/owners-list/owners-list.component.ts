import { getAllOwners } from '../../store/owner.selectors';
import { ownerActionTypes } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Owner } from '../../model/owner.model';
import { OwnerService } from '../../services/owner.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-owners-list',
  templateUrl: './owners-list.component.html'
})
export class OwnersListComponent implements OnInit {

  owners$: Observable<Owner[]>;

  ownerToBeUpdated: Owner;

  isUpdateActivated = false;

  constructor(private ownerService: OwnerService, private store: Store<AppState>) { }

  ngOnInit() {
    this.owners$ = this.store.select(getAllOwners);
  }

  deleteOwner(ownerId: string) {
    this.store.dispatch(ownerActionTypes.deleteOwner({ownerId}));
  }

  showUpdateForm(owner: Owner) {
    this.ownerToBeUpdated = {...owner};
    this.isUpdateActivated = true;
  }

  updateOwner(updateForm) {
    const update: Update<Owner> = {
      id: this.ownerToBeUpdated.id,
      changes: {
        ...this.ownerToBeUpdated,
        ...updateForm.value
      }
    };

    this.store.dispatch(ownerActionTypes.updateOwner({update}));

    this.isUpdateActivated = false;
    this.ownerToBeUpdated = null;
  }
}
