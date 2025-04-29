import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ContactComponent} from "./components/contact/contact.component";
import {MissionComponent} from "./components/mission/mission.component";
import {ProfileComponent} from "./components/profile/profile.component";

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'mission', component: MissionComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
