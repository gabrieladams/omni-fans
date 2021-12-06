import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniFansService } from './services/omnifan.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OmniFansEffects } from './store/omnifan.effects';
import { omniFanReducer } from './store/omnifan.reducers';
import { RouterModule } from '@angular/router';

const routes = [

];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('omnifan', omniFanReducer),
    EffectsModule.forFeature([OmniFansEffects]),
  ],
  providers:[
    OmniFansService
  ],
  exports:[
    RouterModule
  ],
  entryComponents:[
  ]
})
export class OmniFansModule { }
