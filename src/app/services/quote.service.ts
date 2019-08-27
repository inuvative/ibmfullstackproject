import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

@Injectable()
export class QuoteService {

  api_url = 'https://quotes.rest/qod.json';
  defaultQuote = "What you talking 'bout Willis?";

  constructor(
    private http: HttpClient
  ) { }

  getNewQuote(): Observable<any>{
    //returns the observable of http post request 
    return this.http.get(this.api_url).pipe(map(res  => {
        //Maps the response object sent from the server
          
        return res ? res['contents'].quotes[0].quote: this.defaultQuote;
      }));
  }  
}