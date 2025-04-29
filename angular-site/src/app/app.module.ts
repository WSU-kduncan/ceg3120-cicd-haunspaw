import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgOptimizedImage } from '@angular/common';
import { MissionComponent } from './components/mission/mission.component';
import { ContactComponent } from './components/contact/contact.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToastComponent } from './components/toast/toast.component';
import { HttpClientModule } from '@angular/common/http';

import { PhonePipe } from './shared/contact-pipes';
import {ClickOutsideDirective, EmailHighlighterDirective, PhoneHighlighterDirective} from './shared/shared-directives';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    HomepageComponent,
    MissionComponent,
    NavbarComponent,
    AuthModalComponent,
    ToastComponent,
    PhonePipe,
    PhoneHighlighterDirective,
    ProfileComponent,
    ClickOutsideDirective,
    EmailHighlighterDirective
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
