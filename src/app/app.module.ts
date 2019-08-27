import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from './services/employee.service';
import { QuoteService } from './services/quote.service';
import { JokeSerivce } from './services/joke.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [EmployeeService,QuoteService,JokeSerivce],
  bootstrap: [AppComponent]
})
export class AppModule { }
