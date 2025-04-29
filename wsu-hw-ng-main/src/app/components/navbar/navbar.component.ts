import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showModal = false;
  currentUser$: Observable<User | null>

  constructor(private userService: UserService) {
    this.currentUser$ = this.userService.currentUser$;
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  logout(): void {
    this.userService.logout();
    this.closeModal();
  }
}
