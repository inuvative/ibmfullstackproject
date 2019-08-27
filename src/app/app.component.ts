import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { QuoteService } from './services/quote.service';
import { JokeSerivce } from './services/joke.service';
import Employee from './models/employee.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    //Private employeeservice will be injected into the component by Angular Dependency Injector
    private employeeService: EmployeeService,
    private jokeService: JokeSerivce,
    private quoteService: QuoteService
  ) { }

  //Declaring the new Employee Object and initilizing it
  public newEmployee: Employee = new Employee()
  public editEmployee: Employee;
  public selectedEmployee: Employee;

  //An Empty list for the visible Employee list
  employeesList: Employee[];
  errors: ServerError[];

  editing=false;
  adding=false;
  deleteMessage=null;
  errorMessage=null;

  ngOnInit(): void {

    //At component initialization the 
    this.employeeService.getEmployees()
      .subscribe(employees => {
        //assign the Employeelist property to the proper http response
        this.employeesList = employees
        console.log(employees)
      })
  }

  create() {
    this.employeeService.createEmployee(this.newEmployee)
    .subscribe((res) => {
      this.employeesList.push(res)
      this.newEmployee = new Employee()
      this.adding=false;
      this.clearMessages();
    }, err => {
      if(err){
        this.errors = err.error.errors;
      }
    })
  }

  startEdit(employee: Employee) {
    this.clearMessages();
    this.editing=true;
    this.selectedEmployee=employee;
    this.editEmployee = new Employee();
    this.editEmployee._id = employee._id;
    this.editEmployee.firstName = employee.firstName;
    this.editEmployee.lastName = employee.lastName;
    this.editEmployee.hireDate = employee.hireDate;
    this.editEmployee.role = employee.role;
    this.editEmployee.favoriteJoke = employee.favoriteJoke;
    this.editEmployee.favoriteQuote = employee.favoriteQuote;  
  }

  doneEdit(employee:Employee) {
    this.employeeService.editEmployee(employee._id, employee).subscribe((res:Employee) => {
      console.log('update successful');
      let i = this.employeesList.indexOf(this.selectedEmployee);
      this.employeesList[i] = res;
      this.selectedEmployee=null;
      this.editing = false;
      this.clearMessages();
    }, err => {
      console.error('update unsucessful'+ err);
      if(err){
        if(err.error.errors) {
          this.errors = err.error.errors;
        } else {
          this.errorMessage=err.error;
        }
      }
    })
  }

  delete(employee:Employee) {
    this.employeeService.deleteEmployee(employee._id).subscribe(res => {
      this.employeesList.splice(this.employeesList.indexOf(employee),1);
      this.deleteMessage=`${res.firstName} ${res.lastName} deleted successfully`
    }, err => {
      console.log(err);
    })
  }

  clearMessages() {
    this.deleteMessage=null;
    this.errorMessage=null;
    this.errors=null;
  }

  hasError(field:string){
    if(!this.errors) return false;
    return this.errors.find((err) => err.param == field) !== undefined;
  }
  getError(field:string) {
    return this.errors.find((err) => err.param == field).msg
  }

  getJoke(employee:Employee) {
    this.jokeService.getNewJoke()
    .subscribe(joke => {
      //assign the Employeelist property to the proper http response
      employee.favoriteJoke = joke
      console.log(joke)
    })
  }

  getQuote(employee:Employee) {
    this.quoteService.getNewQuote()
    .subscribe(quote => {
      //assign the Employeelist property to the proper http response
      employee.favoriteQuote = quote
      console.log(quote)
    })
  }

  title='app';
}
