import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import {HttpService} from './service/http.service';
import { DetailComponent } from './page/detail/detail.component';
import { RequestSummaryComponent } from './page/request-summary/request-summary.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'request-summary', component: RequestSummaryComponent },
  { path: 'detail', component: DetailComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DetailComponent,
    RequestSummaryComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    HttpModule
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
