import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(private http: HttpClient) { }

  public getOdooData(url: string) {
    return this.http.get(url + '/odoo_app_connector/static/src/js/app.js');
  }
}
