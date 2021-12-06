import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OmniCollectibleAddComponent} from './omnicollectible-add/omnicollectible-add.component';
import { OmniCollectibleHomeComponent } from './omnicollectible-home/omnicollectible-home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'omnifan', component: OmniCollectibleHomeComponent},
  {path: 'omnifan-add', component: OmniCollectibleAddComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
