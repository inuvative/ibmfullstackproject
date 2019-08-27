import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
    })
};

@Injectable()
export class JokeSerivce {

  api_url = 'https://icanhazdadjoke.com';
  defaultJoke = "When is a door not a door? When it's ajar."
  constructor(
    private http: HttpClient
  ) { }

  getNewJoke(): Observable<any>{
    //returns the observable of http post request 
    return this.http.get(this.api_url,httpOptions).pipe(map(res  => {
        //Maps the response object sent from the server
          
        return res ? res['joke'] : this.defaultJoke;
    }));;
  }
}