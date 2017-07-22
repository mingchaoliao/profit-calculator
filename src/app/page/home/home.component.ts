import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpService} from '../../service/http.service';
import {Common} from '../../class/common.class';
import {environment} from '../../../environments/environment';

declare var jquery: any;
declare var $: any;
declare var chrome: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public amazonItems: [any];
  public showAddItemBtn = false;
  public showSubmitBtn = false;
  public deleteItemIndex = -1;
  public tabTitle = '';
  public submitItems = [];
  public asin;


  constructor(public http: HttpService, public changeDetectorRef: ChangeDetectorRef) {}

  getTab(tab) {
    const url = tab.url;
    const re = url.match(/amazon.com.+gp\/product\/[A-Z0-9]{9,12}|amazon.com.+dp\/[A-Z0-9]{9,12}/g);
    if (re && re.length) {
      const tmp = url.match(/(product\/|dp\/)[A-Z0-9]{9,13}/g)[0];
      if (tmp.includes('/')) {
        const asin = tmp.substr(tmp.indexOf('/') + 1);
        this.http.get(environment.url + 'api/pc_check_user_amazon_item/' + asin, {}).subscribe(
          s => {
            s = s.body;
            if (!s.message) {
              this.asin = asin;
              this.showAddItemBtn = true;
              let title = tab.title;
              if (title.length > 30) {
                title = title.substr(0, 30) + '...';
              }
              this.tabTitle = title;
              this.changeDetectorRef.detectChanges();
            }
          },
          e => {

          }
        );
      }
    }
  }

  ngOnInit() {
    if (Common.isProd()) {
      chrome.tabs.getSelected(null, this.getTab.bind(this));
    } else {

    }
    this.getList();
  }

  getList() {
    this.http.get(environment.url + 'api/pc_amazon_item', []).subscribe(
      s => {
        s = s['body'];
        for (let i = 0; i < s.length; i++) {
          s[i].checked = false;
        }
        this.amazonItems = s;
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

  rowClick(index) {
    this.amazonItems[index].checked = !this.amazonItems[index].checked;
    let tmp = false;
    for (let i = 0; i < this.amazonItems.length; i++) {
      if (this.amazonItems[i].checked) {
        tmp = true;
      }
    }
    this.showSubmitBtn = tmp;
  }

  selectAll() {
    let isChecked = false;
    for (let i = 0; i < this.amazonItems.length; i++) {
      if (!this.amazonItems[i].pc_request_status) {
        this.amazonItems[i].checked = true;
        isChecked = true;
      }
    }
    if (isChecked) {
      this.showSubmitBtn = true;
    }
  }

  deselectAll() {
    for (let i = 0; i < this.amazonItems.length; i++) {
      this.amazonItems[i].checked = false;
    }
    this.showSubmitBtn = false;
  }

  submit() {
    this.submitItems = [];
    for (let i = this.amazonItems.length - 1; i >= 0; i--) {
      if (this.amazonItems[i].checked) {
        this.submitItems.push(this.amazonItems[i]);
      }
    }

    $('#submit-confirm-modal').modal('show');
  }

  submitConfirmed() {
    const payload = [];
    for (let i = 0; i < this.submitItems.length; i++) {
      payload.push(this.submitItems[i]['pc_user_amazon_item_id']);
    }
    this.http.post(environment.url + 'api/pc_request', {}, payload).subscribe(
      s => {
        s = s.body;
        console.log(s.id);
        this.getList();
        this.showSubmitBtn = false;
        this.deselectAll();
        $('#submit-confirm-modal').modal('hide');
      },
      e => {

      }
    );
  }

  deleteItem(i) {
    this.deleteItemIndex = i;
    $('#delete-confirm-modal').modal('show');
  }

  deleteItemConfirmed() {
    this.http.delete(environment.url + 'api/pc_amazon_item/' + this.amazonItems[this.deleteItemIndex].pc_user_amazon_item_id, {}).subscribe(
      s => {
        this.amazonItems.splice(this.deleteItemIndex, 1);
        this.changeDetectorRef.detectChanges();
        $('#delete-confirm-modal').modal('hide');
      },
      e => {

      }
    );
  }

  productNameClicked(asin) {
    if (Common.isProd()) {
      chrome.tabs.create({'url': 'https://www.amazon.com/dp/' + asin}, function(tab) {});
    } else {
      window.open('https://www.amazon.com/dp/' + asin, '_blank');
    }
  }

  addCurrentItem() {
    if (!this.showAddItemBtn) {
      return;
    }
    this.http.post(environment.url + 'api/pc_amazon_item', {}, {asin: this.asin}).subscribe(
      s => {
        this.tabTitle = '';
        this.getList();
      },
      e => {

      }
    );
  }
}
