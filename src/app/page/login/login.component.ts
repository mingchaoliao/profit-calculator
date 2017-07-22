import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpService} from '../../service/http.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  template: `
    <form class="form-horizontal" [formGroup]="loginForm" (submit)="onSubmit()">
      <div class="form-group">
        <label for="email" class="col-md-4 control-label">E-Mail Address</label>

        <div class="col-md-6">
          <input id="email" type="email" class="form-control" name="email" value="" required="" autofocus="" formControlName="email">

        </div>
      </div>

      <div class="form-group">
        <label for="password" class="col-md-4 control-label">Password</label>

        <div class="col-md-6">
          <input id="password" type="password" class="form-control" name="password" required="" formControlName="password">

        </div>
      </div>

      <div class="form-group">
        <div class="col-md-8 col-md-offset-4">
          <button type="submit" class="btn btn-primary">
            Login
          </button>

          <a class="btn btn-link" href="http://askidea.app/password/reset">
            Forgot Your Password?
          </a>
        </div>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(public formBuilder: FormBuilder, public http: HttpService, public router: Router) { }

  public loginForm: FormGroup;

  onSubmit() {
    this.http.post(environment.url + 'api/login', {}, this.loginForm.value).subscribe(
      s => {
        s = s['body'];
        localStorage.setItem('token', s['token']);
        localStorage.setItem('id', s['id']);
        localStorage.setItem('name', s['name']);
        localStorage.setItem('email', s['email']);
        localStorage.setItem('role_id', s['role_id']);
        localStorage.setItem('role_name', s['role_name']);
        this.router.navigate(['']);
      },
      e => {

      }
    );
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': [],
      'password': []
    });
  }

}
