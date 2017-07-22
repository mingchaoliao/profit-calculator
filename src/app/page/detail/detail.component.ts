import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpService} from '../../service/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  public requestedItemDetails: [any];
  public back;
  public requestId;
  public requestedItemId;


  constructor(public http: HttpService,
              public changeDetectorRef: ChangeDetectorRef,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.activatedRoute.queryParams.subscribe(
      param => {
        if (!param.back || !param.requestedItemId || (param.back === 'request-summary' && !param.requestId)) {
          this.router.navigate(['']);
          return;
        }
        this.back = param.back;
        this.requestId = param.requestId;
        this.requestedItemId = param.requestedItemId;
        this.getRequestedItemDetail(param.requestedItemId);
      }
    );
  }

  getRequestedItemDetail(requestedItemId) {
    this.http.get(environment.url + 'api/pc_request_item/' + requestedItemId, {}).subscribe(
      s => {
        s = s.body;
        this.requestedItemDetails = s;
      },
      e => {

      }
    );
  }

  ngOnInit() {

  }

}
