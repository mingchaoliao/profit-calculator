import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Common} from './class/common.class';

declare var chrome: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public router: Router) {}

  ngOnInit(): void {

      if (!localStorage.getItem('token')) {
        this.router.navigate(['', 'login']);
      }

  }

}
