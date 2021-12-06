import { Owner } from '../../model/owner.model';
import { registerOwner, registerOwnerSuccess, registerOwnerWithMetamask } from '../../store/owner.actions';
import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Attribute, Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-owner-modal',
  templateUrl: './register-owner-modal.component.html'
})
export class RegisterOwnerModalComponent implements OnInit {
  constructor(private store: Store<AppState>,
    public activeModal: NgbActiveModal,
    private modalService:NgbModal
   ) { }

  ngOnInit() {
  }

  register(form) {
    if (form.invalid) {
      return;
    }
    let owner=form.value;
    this.store.dispatch(registerOwner({owner,isModal:true}));
    this.store.select(registerOwnerSuccess).subscribe(()=>{
        this.activeModal.close()
    })
  }
}
