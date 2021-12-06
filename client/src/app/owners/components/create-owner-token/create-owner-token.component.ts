import { Owner } from '../../model/owner.model';
import { registerOwner } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Attribute, Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-owner-token',
  templateUrl: './create-owner-token.component.html'
})
export class CreateOwnerTokenComponent implements OnInit {
  constructor(private store: Store<AppState>,
   ) { }

  ngOnInit() {
  }

  register(form) {
    if (form.invalid) {
      return;
    }
    let owner=form.value;
    this.store.dispatch(registerOwner({owner}));

  }
}
