import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpService} from '../../service/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.css']
})
export class RequestSummaryComponent implements OnInit {

  constructor(public http: HttpService,
              public changeDetectorRef: ChangeDetectorRef,
              public router: Router,
              public activatedRoute: ActivatedRoute) {

  }

  public requests: [any];

  ngOnInit() {
    this.getSummary();
  }

  getSummary() {
    this.http.get(environment.url + 'api/pc_request', []).subscribe(
      s => {
        s = s['body'];
        for (let i = 0; i < s.length; i++) {
          s[i].checked = false;
        }
        this.requests = s;
        this.changeDetectorRef.detectChanges();
        this.activatedRoute.queryParams.subscribe(
          param => {
            if (param.requestId) {
              for (let i = 0; i < this.requests.length; i++) {
                if (this.requests[i].pc_request_id == param.requestId) {
                  this.collapseController(i);
                  break;
                }
              }
            }
          }
        );
      },
      e => {

      }
    );
  }

  collapseController(index) {
    if ($('#collapse' + index).hasClass('in')) {
      $('#collapse' + index).collapse('hide');
    } else {
      for (let i = 0; i < this.requests.length; i++) {
        $('#collapse' + i).collapse('hide');
      }
      $('#collapse' + index).collapse('show');
      this.loadDetail(index);
    }
  }

  loadDetail(index) {
    if (!this.requests[index].detail) {
      this.http.get(environment.url + 'api/pc_request/' + this.requests[index].pc_request_id, []).subscribe(
        s => {
          s = s['body'];
          this.requests[index]['detail'] = s;
          this.changeDetectorRef.detectChanges();
        },
        e => {

        }
      );
    }
  }

  viewItemDetail(requestIndex, requestedItemIndex) {
    if (this.requests[requestIndex].detail[requestedItemIndex].status !== 'Completed') {
      return;
    }
    this.router.navigate(['', 'detail'], {queryParams:
      {back: 'request-summary',
        requestedItemId: this.requests[requestIndex].detail[requestedItemIndex].pc_request_item_id,
        requestId: this.requests[requestIndex].pc_request_id
      }});
  }

  floor(num) {
    return Math.floor(num);
  }
}
