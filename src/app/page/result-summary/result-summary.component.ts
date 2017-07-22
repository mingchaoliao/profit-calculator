import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpService} from '../../service/http.service';
import {environment} from '../../../environments/environment';
import {Common} from '../../class/common.class';

declare var $: any;
declare var chrome: any;

@Component({
  selector: 'app-result-summary',
  templateUrl: './result-summary.component.html',
  styleUrls: ['./result-summary.component.css']
})
export class ResultSummaryComponent implements OnInit {

  public records: [any];

  // 0: unsorted, 1: asc, -1 desc
  public sortStatus = {
    'product_name': 0,
    'asin': 0,
    'rank': 0,
    'estimated_sales': 0,
    'max_roi': 0,
    'min_roi': 0,
    'moq': 0,
  };

  constructor(public http: HttpService, public changeDetectorRef: ChangeDetectorRef) {
  }

  getResultSummary() {
    this.http.get(environment.url + 'api/pc_result_summary', {}).subscribe(
      s => {
        s = s.body;
        this.records = s;
        this.changeDetectorRef.detectChanges();
        $('span[data-toggle="tooltip"]').tooltip({
          animated: 'fade',
          placement: 'bottom',
          html: true
        });
      },
      e => {

      }
    );
  }

  productNameClicked(asin) {
    if (Common.isProd()) {
      chrome.tabs.create({'url': 'https://www.amazon.com/dp/' + asin}, function (tab) {
      });
    } else {
      window.open('https://www.amazon.com/dp/' + asin, '_blank');
    }
  }

  ngOnInit() {
    this.getResultSummary();
  }

  clone(obj) {
    if (null == obj) {
      return obj;
    }
    const copy = obj.constructor();
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  sortAsc(key) {
    const n = this.records.length;
    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = n - 1; j >= i + 1; j--) {
        if (this.records[j][key] < this.records[j - 1][key]) {
          const tmp = this.clone(this.records[j - 1]);
          this.records[j - 1] = this.clone(this.records[j]);
          this.records[j] = this.clone(tmp);
          swapped = true;
        }
      }
      if (!swapped) {
        break;
      }
    }
  }

  sortDesc(key) {
    const n = this.records.length;
    for (let i = n - 1; i >= 0; i--) {
      let swapped = false;
      for (let j = 0; j < i; j++) {
        if (this.records[j][key] < this.records[j + 1][key]) {
          const tmp = this.clone(this.records[j + 1]);
          this.records[j + 1] = this.clone(this.records[j]);
          this.records[j] = this.clone(tmp);
          swapped = true;
        }
      }
      if (!swapped) {
        break;
      }
    }
  }

  sortResults(key) {
    if (this.sortStatus[key] === 0) {
      this.sortAsc(key);
      this.sortStatus[key] = 1;
    } else if (this.sortStatus[key] === 1) {
      this.sortDesc(key);
      this.sortStatus[key] = -1;
    } else {
      this.sortAsc(key);
      this.sortStatus[key] = 1;
    }

    for (const attr in this.sortStatus) {
      if (this.sortStatus.hasOwnProperty(attr) && attr !== key) {
        this.sortStatus[attr] = 0;
      }
    }

    this.changeDetectorRef.detectChanges();
    $('span[data-toggle="tooltip"]').tooltip({
      animated: 'fade',
      placement: 'bottom',
      html: true
    });
  }

}
