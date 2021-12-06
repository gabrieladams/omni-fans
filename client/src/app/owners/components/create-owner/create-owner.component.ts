import { Owner } from '../../model/owner.model';
import { createOwner } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-owner',
  templateUrl: './create-owner.component.html'
})
export class CreateOwnerComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(form.value);

    if (form.invalid) {
      return;
    }



    this.store.dispatch(createOwner({owner:form.value}));

  }
}
