import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TokenService } from "./services/token.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { TokenEffects } from "./store/token.effects";
import { tokenReducer } from "./store/token.reducers";
import { RouterModule } from "@angular/router";
import { TokenResolver } from "./token.resolver";
import {  NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TokensListComponent } from "./components/tokens-list/tokens-list.component";
import { CreateEditTokenComponent } from "./components/create-edit-token/create-edit-token.component";
import { FileUploadModule } from 'ng2-file-upload';
import { CreateEditTokenResolver } from "./components/create-edit-token/create-edit-token.resolver";
import { GalleryModule } from 'ng-gallery';
import { ViewTokenModalComponent } from "./components/view-token-modal/view-token-modal.component";
import { MomentModule } from 'ngx-moment';

const routes = [
  {
    path: "tokens-list",
    component: TokensListComponent,
    resolve: {
      tokens: TokenResolver,
    },
  },
  {
    path: "create-edit-token",
    component: CreateEditTokenComponent,
    resolve: {
      token: CreateEditTokenResolver,
    },
  },
  {
    path: "create-edit-token/:id",
    component: CreateEditTokenComponent,
    resolve: {
      token: CreateEditTokenResolver,
    },
  },
  
  
];

@NgModule({
  declarations: [
    TokensListComponent,
    CreateEditTokenComponent,
    ViewTokenModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    MomentModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature("tokens", tokenReducer),
    EffectsModule.forFeature([TokenEffects]),
    NgbModule,
    FileUploadModule
  ],
  providers: [TokenService, TokenResolver,CreateEditTokenResolver],
  exports: [TokensListComponent, RouterModule],
  entryComponents: [],
})
export class TokensModule {}
