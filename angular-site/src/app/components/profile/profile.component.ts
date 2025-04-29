import {Component, OnInit} from '@angular/core';

import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null | undefined;
  changePassword: boolean = false;
  password: string = '';

  constructor(private user: UserService, private toastr: ToastService) {
  }

  ngOnInit() { // check to see if we are allowed to be on this page onInit (prevent errant routing)
    this.user.currentUser$.subscribe((data) => {
      this.currentUser = data;
      this.password = data?.password ?? '';
    });
    this.toastr.showToast({
      message: 'Welcome Back',
      type: 'success'
    });
  }

  doChangePassword() {
    const updatedUser: User = {
      id: this.currentUser?.id ?? 0,
      username: this.currentUser?.username ?? '',
      password: this.password ?? '',
      email: this.currentUser?.email ?? ''
    }
    this.user.updateUser(this.currentUser?.id ?? 1234, updatedUser);
    this.changePassword = false;
  }
}
