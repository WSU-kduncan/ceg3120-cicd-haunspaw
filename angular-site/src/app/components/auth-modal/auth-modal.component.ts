import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import {User} from "../../models/user.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  authForm: FormGroup;
  isRegisterMode = false;
  isProfileMode = false;
  currentUser$: Observable<User | null>;

  constructor(private fb: FormBuilder, private userService: UserService, private toastService: ToastService) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['']  // Only required during registration or profile update
    });
    // Directly assign the observable
    this.currentUser$ = this.userService.currentUser$;
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => this.initializeFormForUser(user));
  }

  private initializeFormForUser(user: User | null): void {
    if (user) {
      this.isProfileMode = true;
      this.authForm.patchValue(user);
    } else {
      this.isProfileMode = false;
      this.authForm.reset();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closeModal();
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.isProfileMode = false;

    this.updateEmailValidators();
    this.resetForm();
  }

  private updateEmailValidators(): void {
    if (this.isRegisterMode) {
      this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    } else {
      this.authForm.get('email')?.clearValidators();
    }
    this.authForm.get('email')?.updateValueAndValidity();
  }

  private resetForm(): void {
    this.authForm.reset();
    Object.keys(this.authForm.controls).forEach(control => {
      this.authForm.get(control)?.markAsUntouched();
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    if (this.isProfileMode) {
      this.updateProfile();
    } else if (this.isRegisterMode) {
      this.registerUser();
    } else {
      this.loginUser();
    }

    this.authForm.reset();
    this.closeModal();
  }

  private updateProfile(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        const updatedUser: User = { ...user, ...this.authForm.value };
        this.userService.updateUser(updatedUser.id, updatedUser);
        this.toastService.showToast({ message: 'Profile updated successfully', type: 'success' });
      }
    });
  }

  private registerUser(): void {
    const { username, password, email } = this.authForm.value;
    if (this.userService.userExists(username)) {
      this.toastService.showToast({ message: 'Username already exists', type: 'error' });
      return;
    }
    const newUser = { username, password, email } as User;
    this.userService.addUser(newUser);
    this.userService.setCurrentUser(newUser);
    this.toastService.showToast({ message: 'Registration successful', type: 'success' });
  }

  private loginUser(): void {
    const { username, password } = this.authForm.value;
    const user = this.userService.login(username, password);
    if (user) {
      this.userService.setCurrentUser(user);
      this.toastService.showToast({ message: 'Login successful', type: 'success' });
    } else {
      this.toastService.showToast({ message: 'Invalid username or password', type: 'error' });
    }
  }

  hasErrors(controlName: string): boolean {
    const control = this.authForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  closeModal(): void {
    this.close.emit();
  }
}
