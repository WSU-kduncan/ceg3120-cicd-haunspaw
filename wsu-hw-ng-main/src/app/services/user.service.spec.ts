import { of } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpClient: jasmine.SpyObj<any>;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new UserService(httpClient);
  });

  it('should retrieve all users', () => {
    const dummyUsers: User[] = [
      { id: 1, username: 'JohnDoe', password: '123456', email: 'john@example.com' },
      { id: 2, username: 'JaneDoe', password: 'abcdef', email: 'jane@example.com' }
    ];

    httpClient.get.and.returnValue(of<User[]>(dummyUsers));

    service.getUserViaHttp().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });
  });

  it('should retrieve a user by ID', () => {
    const dummyUser: User = { id: 1, username: 'JohnDoe', email: 'john@example.com', password: '123456' };

    httpClient.get.and.returnValue(of<User>(dummyUser));

    service.getUserByIdViaHttp(1).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });
  });

  it('should add a new user', () => {
    const newUser: User = { id: 3, username: 'SamSmith', email: 'sam@example.com', password: 'password' };

    httpClient.post.and.returnValue(of<User>(newUser));

    service.addUserViaHttp(newUser).subscribe(user => {
      expect(user).toEqual(newUser);
    });
  });

  it('should update an existing user', () => {
    const updatedUser: User = { id: 1, username: 'JohnDoeUpdated', email: 'johnupdated@example.com', password: 'newpassword' };

    httpClient.put.and.returnValue(of<User>(updatedUser));

    service.updateUserViaHttp(updatedUser.id, updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });
  });

  it('should delete a user', () => {
    httpClient.delete.and.returnValue(of(undefined));

    service.deleteUserViaHttp(1).subscribe(response => {
      expect(response).toBeUndefined();
    });
  });
});
