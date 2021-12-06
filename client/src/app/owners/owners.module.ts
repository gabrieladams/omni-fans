import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerService } from './services/owner.service';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OwnerEffects } from './store/owner.effects';
import { ownerReducer } from './store/owner.reducers';
import { CreateOwnerComponent } from './components/create-owner/create-owner.component';
import { OwnersListComponent } from './components/owners-list/owners-list.component';
import { RouterModule } from '@angular/router';
import { OwnerResolver } from './owner.resolver';
import { LoginOwnerComponent } from './components/login-owner/login-owner.component';
import { RegisterOwnerComponent } from './components/register-owner/register-owner.component';
import { RegisterOwnerMetamaskComponent } from './components/register-owner-metamask/register-owner-metamask.component';
import { OwnerProfileComponent } from './components/owner-profile/owner-profile.component';
import { LoginOwnerModalComponent } from './components/login-owner-modal/login-owner-modal.component';
import { RegisterOwnerModalComponent } from './components/register-owner-modal/register-owner-modal.componet';
import { FileUploadModule } from 'ng2-file-upload';
import { CreateOwnerTokenComponent } from './components/create-owner-token/create-owner-token.component';
import { MomentModule } from 'ngx-moment';
const routes = [
  {
    path: "owners",
    component: OwnersListComponent,
    resolve: {
      owners: OwnerResolver,
    },
  },
  { path: "create-owner", component: CreateOwnerComponent },
  { path: "create-owner-token", component: CreateOwnerTokenComponent },
  { path: "login-owner", component: LoginOwnerComponent },
  { path: "register-owner", component: RegisterOwnerComponent },
  { path: "owner-profile", component: OwnerProfileComponent },
  { path: "register-owner-metamask", component: RegisterOwnerMetamaskComponent },
];

@NgModule({
  declarations: [
    CreateOwnerComponent,
    CreateOwnerTokenComponent,
    OwnersListComponent,
    LoginOwnerComponent,
    RegisterOwnerComponent,
    RegisterOwnerMetamaskComponent,
    OwnerProfileComponent,
    LoginOwnerModalComponent,
    RegisterOwnerModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    FileUploadModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature("owners", ownerReducer),
    EffectsModule.forFeature([OwnerEffects]),
  ],
  providers: [OwnerService, OwnerResolver],

  exports: [CreateOwnerComponent, OwnersListComponent, RouterModule],
  entryComponents: [LoginOwnerModalComponent, RegisterOwnerModalComponent],
})
export class OwnersModule {}
