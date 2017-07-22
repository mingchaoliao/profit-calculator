import { Injectable } from '@angular/core';
import {Headers, Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {Common} from '../class/common.class';
import {Router} from "@angular/router";

@Injectable()
export class HttpService {
  private token: string;

  constructor(
    private http: Http, public router: Router) {
    this.getTokenFormLocalStorage();
  }

  private getTokenFormLocalStorage() {
    this.token = localStorage.getItem('token');
  }

  private createHeader(method) {
    this.getTokenFormLocalStorage();
    const myHeader: Headers = new Headers();
    myHeader.append('Content-Type', 'application/json');
    myHeader.append('Accept', 'application/json');
    if (this.token) {
      myHeader.append('Authorization', 'Bearer ' + this.token);
    }

    return myHeader;
  }

  get(url, params, option = {}) {
    const rtn = this.http.get(url + Common.serialize(params), {headers: this.createHeader('GET')});
    return rtn.map(data => this.handleSuccess(data, option))
      .catch(error => this.handleError(error, option));
  }

  post(url, params, data, option = {}) {
    const rtn = this.http.post(url + Common.serialize(params), JSON.stringify(data), {headers: this.createHeader('POST')});
    return rtn
      .map(data => this.handleSuccess(data, option))
      .catch(error => this.handleError(error, option));

  }

  put(url, params, data, option = {}) {
    const rtn = this.http.put(url + Common.serialize(params), JSON.stringify(data), {headers: this.createHeader('PUT')});
    return rtn.map(data => this.handleSuccess(data, option))
      .catch(error => this.handleError(error, option));
  }

  delete(url, params, option = {}) {
    const rtn = this.http.delete(url + Common.serialize(params), {headers: this.createHeader('DELETE')});
    return rtn.map(data => this.handleSuccess(data, option))
      .catch(error => this.handleError(error, option));
  }

  private handleSuccess(data, option = {}) {
    const rtn = {};
    rtn['body'] = data.json();
    rtn['headers'] = {};
    if (data.headers.get('X-Total-Count')) {
      rtn['headers']['x_total_count'] = data.headers.get('X-Total-Count');
    }
    if (data.headers.get('Link')) {
      rtn['headers']['link'] = {};
      rtn['headers']['link'] = this.processLinkHeader(data.headers.get('Link'));
    }
    return rtn;
  }

  private processLinkHeader(linkHeader) {
    const container = {};
    const links = linkHeader.split(',').map((link) => {
      link = link.trim();
      const rtn = link.split(';').map((a) => a.trim());
      if (rtn[0].startsWith('<') && rtn[0].endsWith('>')) rtn[0] = rtn[0].substring(1, rtn[0].length - 1);
      rtn[1] = rtn[1].split('=').map((b) => b.trim())[1];
      return rtn;
    });
    for (let i = 0; i < links.length; i++) {
      container[links[i][1]] = links[i][0];
    }
    return container;
  }

  private handleError (error: any, option = {}) {
    if (JSON.parse(error.status) === 401) {
      localStorage.clear();
      this.router.navigate(['', 'login']);
    }
    return Observable.throw(JSON.parse(error._body).message);
  }

}
