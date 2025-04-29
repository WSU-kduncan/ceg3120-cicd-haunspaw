import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User, User1 } from './shared.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService { // Utilize shared service functionality here

  constructor(private http: HttpClient) {
  }

  // TODO: store objects / variables to persist between components
  user: User[] = []; // have an array of potential valid users?
  // showcase utilizing a constructor for class vs interface
  adminUser: User1 = new User1('John Doe', 'jdoe@yahoo.net', '123-456-7890', 'Add more articles to the site!');

  emailRegex: RegExp = /(\w+@\w+\.\w{3,})*$/; // pattern to match multiple word characters followed by an @ symbol, multiple word characters, followed by a . followed by 3 or more word characters
  phoneRegex: RegExp = /(\(\d\)\-)?\d{3}\-\d{3}\-\d{4}/g; // pattern to match an optional digit enclosed in parantheses followed by 3 numbers, a dash, 3 numbers, a dash and 4 numbers

  // TODO: fill in and correct our http call functions
  doPost(url: any, reqBody: string, headers?: HttpHeaders): Observable<any> { // execute a POST call
    const options = {
      headers: headers
    }
    return this.http.post(url, reqBody, options).pipe(res => { // allow individual components to subscribe to the results produced by this call
      return res;
    })
  }

  doPut(url: any, reqBody: string, headers?: HttpHeaders): Observable<any> { // execute a PUT call
    const options = {
      headers: headers
    }
    return this.http.put(url, reqBody, options).pipe(res => { // allow individual components to subscribe to the results produced by this call
      return res;
    })
  }

  doGet(url: any, headers?: HttpHeaders): Observable<any> { // execute a GET call
    const options = {
      headers: headers
    }
    return this.http.get(url, options).pipe(res => { // allow individual components to subscribe to the results produced by this call
      return res;
    })
  }

  // TODO: write at least one utility function and use it in multiple components

}
