import { AppState } from '../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { OmniFans } from 'src/app/omnifan/model/omni.fan.model';
import { isOwnerAccountBalanceLoaded, ownerAccountBalance } from 'src/app/omnifan/store/omnifan.selectors';
import { ToastService } from 'src/app/toasts/toast.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { selectedTokenForEdit } from '../../store/token.selectors';
import { Observable } from 'rxjs';
import { Token } from '../../model/token.model';
import { getSelectedTokenForEdit } from '../../store/token.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-token-modal',
  templateUrl: './view-token-modal.component.html',
  styleUrls:['./view-token-modal.component.scss']
})
export class ViewTokenModalComponent implements OnInit {
  token$:Observable<Token>;
  @Input() tokenID: string;
  rootUrl=(environment.production?'https://omnifans.net':'http://localhost:3001');
  profilePhotoImages = [];
  constructor(
    private store: Store<AppState>,
    public activeModal: NgbActiveModal,
    private modalService:NgbModal
    ) {

    }

  ngOnInit() {
    this.token$=this.store.select(selectedTokenForEdit);
    this.store.dispatch(getSelectedTokenForEdit({id:this.tokenID}));

    this.token$.subscribe((token)=>{
      this.profilePhotoImages=[];
      token?.profile_photos?.forEach((value) => {
        this.profilePhotoImages.push(
          {
            src: this.rootUrl+'/' + value,
            thumb: this.rootUrl +'/'+ value,
          }
        );
      });
    })
  }

}
