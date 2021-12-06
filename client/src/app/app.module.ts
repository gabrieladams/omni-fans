import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OmniFansModule } from './omnifan/omnifan.module';
import { ToastsContainer } from './toasts/toast-container.component';
import { OwnersModule } from './owners/owners.module';
import { StoreRouterConnectingModule,routerReducer } from '@ngrx/router-store';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GlobalHttpInterceptorService } from './services/http.interceptor';
import { CompareDirective } from './compare-password.directive';
import { OmniCollectibleHomeComponent } from './omnicollectible-home/omnicollectible-home.component';
import { OmniCollectibleAddComponent } from './omnicollectible-add/omnicollectible-add.component';
import { FileUploadModule,FileSelectDirective } from 'ng2-file-upload';
import { GalleryModule } from 'ng-gallery';
import { CollectiblesModule } from './collectibles/collectibles.module';
import { TokensModule } from './tokens/token.module';
import { LoginActivate } from './services/login.activate';
import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [
    AppComponent,
    ToastsContainer,
    HomeComponent,
    OmniCollectibleAddComponent,
    OmniCollectibleHomeComponent,
    NavbarComponent,
    CompareDirective
  ],
  imports: [
    BrowserModule,
    MomentModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    FileUploadModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({maxAge: 25}),
    OmniFansModule,
    OwnersModule,
    TokensModule,
    CollectiblesModule,
    NgbModule,
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forFeature('router',routerReducer),

  ],
  bootstrap: [AppComponent],
  exports:[
    CompareDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true  },LoginActivate
]
})
export class AppModule {

  constructor(configModal: NgbModalConfig){
    configModal.backdrop = 'static';
    configModal.keyboard = false;
  }
}
