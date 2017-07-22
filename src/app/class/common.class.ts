import {FormGroup} from '@angular/forms';
import {environment} from '../../environments/environment';
export class Common {
  static getFormDirtyValue(formGroup: FormGroup, obj: any) {
    Object.keys(formGroup.controls).forEach((key) => {
      const currentControl = formGroup.controls[key];
      if (currentControl.dirty) {
        obj[key] = currentControl.value;
      }
    });
  }

  static isProd() {
    return environment.production;
  }

  static getSelect2Options(data, id, text) {
    return data.map((item, index) => {
      return {
        id: item[id],
        text: item[text]
      };
    });
  }

  static syncDataWithDirtyValues(data, dirtyValues) {
    for (const key in dirtyValues) {
      if (dirtyValues.hasOwnProperty(key)) {
        data[key] = dirtyValues[key];
      }
    }
  }

  static serialize(obj, obj2 = {}) {
    if (obj === {} && obj2 === {}) {
      return '';
    }
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    for (const p in obj2) {
      if (obj2.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj2[p]));
      }
    }

    const rtn = str.join('&');
    return rtn ? '?' + rtn : '';

  }

  static combine(arr: [any]) {
    const rtn = {};
    for (const obj of arr) {
      for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
          rtn[p] = obj[p];
        }
      }
    }
    return rtn;
  }
}
