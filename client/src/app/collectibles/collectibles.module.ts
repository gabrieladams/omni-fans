import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollectibleService } from "./services/collectible.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { CollectibleEffects } from "./store/collectible.effects";
import { collectibleReducer } from "./store/collectible.reducers";
import { RouterModule } from "@angular/router";
import { CollectibleResolver } from "./collectible.resolver";
import {  NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CollectiblesListComponent } from "./components/collectibles-list/collectibles-list.component";
import { CreateEditCollectibleComponent } from "./components/create-edit-collectible/create-edit-collectible.component";
import { FileUploadModule } from 'ng2-file-upload';
import { CreateEditCollectibleResolver } from "./components/create-edit-collectible/create-edit-collectible.resolver";
import { GalleryModule } from 'ng-gallery';
import { ViewCollectibleModalComponent } from "./components/view-collectible-modal/view-collectible-modal.component";
import { MomentModule } from 'ngx-moment';

const routes = [
  {
    path: "collectibles-list",
    component: CollectiblesListComponent,
    resolve: {
      collectibles: CollectibleResolver,
    },
  },
  {
    path: "collectibles-list/:owner",
    component: CollectiblesListComponent,
    resolve: {
      collectibles: CollectibleResolver,
    },
  },
  {
    path: "create-edit-collectible",
    component: CreateEditCollectibleComponent,
    resolve:{
      collectible: CreateEditCollectibleResolver,
    }
  },
  {
    path: "create-edit-collectible/:id",
    component: CreateEditCollectibleComponent,
    resolve: {
      collectible: CreateEditCollectibleResolver,
    },
  },
];

@NgModule({
  declarations: [
    CollectiblesListComponent,
    CreateEditCollectibleComponent,
    ViewCollectibleModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    GalleryModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature("collectibles", collectibleReducer),
    EffectsModule.forFeature([CollectibleEffects]),
    NgbModule,
    FileUploadModule
  ],
  providers: [CollectibleService, CollectibleResolver,CreateEditCollectibleResolver],
  exports: [CollectiblesListComponent, RouterModule],
  entryComponents: [],
})
export class CollectiblesModule {}
