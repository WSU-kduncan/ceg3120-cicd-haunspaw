import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'assets/mock-users.json';
  private users: User[] = [];
  private apiUrl = 'https://mockapi.io/users'; // This is a mock URL for demonstration purposes

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastService) {
    this.loadUsers();
  }

  // Load users from the local JSON file
  private loadUsers(): void {
    this.http.get<User[]>(this.usersUrl).subscribe({
      next: users => {
        this.users = users;
      }, error: error => {
        console.error('Error loading users', error);
    }})
  }

  // HTTP methods for a mocked API
  getUserViaHttp(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUserByIdViaHttp(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUserViaHttp(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUserViaHttp(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUserViaHttp(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Local data methods using hardcoded JSON
  getUsers(): Observable<User[]> {
    // Ensure users are loaded before accessing them
    if (this.users.length > 0) {
      return of(this.users);
    } else {
      return this.http.get<User[]>(this.usersUrl).pipe(
        map(users => {
          this.users = users;
          return users;
        })
      );
    }
  }

  addUser(user: User): void {
    user.id = this.getNextAvailableId();
    this.users.push(user);
  }

  // Helper method to determine the next available ID
  private getNextAvailableId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
  }

  updateUser(id: number, updatedUser: User): void {
    if (updatedUser.password.match(/\w{5,10}/) && updatedUser.username.match(/\w{5,10}/)){
      const index = this.users.findIndex(user => user.id === id);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.setCurrentUser(updatedUser);
      }
      this.toastr.showToast({
        message: 'User Updated',
        type: 'success'
      });
    } else {
      this.toastr.showToast({
        message: 'Please make your username / password 5-10 alphanumeric characters',
        type: 'error'
      });
    }
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  userExists(username: string): boolean {
    return this.users.some(user => user.username === username);
  }

  login(username: string, password: string): User | null {
    return this.users.find(user => user.username === username && user.password === password) || null;
  }

  logout(): void {
    this.setCurrentUser(null);
  }
}
