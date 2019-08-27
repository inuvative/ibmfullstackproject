import Employee from '../models/employee.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

@Injectable()
export class EmployeeService {

  employeeUrl = '/api/employees';

  constructor(
    private http: HttpClient
  ) { }

  //Create Employee, takes a Employee Object
  createEmployee(employee: Employee): Observable<any>{
    //returns the observable of http post request 
    return this.http.post(this.employeeUrl, employee);
  }

  //Read Employee, takes no arguments
  getEmployees(): Observable<Employee[]>{
    return this.http.get(this.employeeUrl).pipe(map(res  => {
      //Maps the response object sent from the server
        
      return (res || []) as Employee[];
    }))
  }
  //Update Employee, takes a Employee Object as parameter
  editEmployee(id:string,employee:Employee){
    let editUrl = `${this.employeeUrl}/${id}`
    //returns the observable of http put request 
    return this.http.put(editUrl, employee);
  }

  deleteEmployee(id:string):any{
    //Delete the object by the id
    let deleteUrl = `${this.employeeUrl}/${id}`
    return this.http.delete(deleteUrl);
  }

  //Default Error handling method.
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}