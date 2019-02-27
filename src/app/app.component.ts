import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JsonService } from './services/json.service';

declare var navigator: any;
declare var window: any;
declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('odoo_url') odoo_url: ElementRef;
  @ViewChild('odoo_db') odoo_db: ElementRef;
  @ViewChild('odoo_user') odoo_user: ElementRef;
  @ViewChild('odoo_pass') odoo_pass: ElementRef;
  public odoo_url_value = '';
  public odoo_db_value = '';
  public odoo_user_value = '';
  public odoo_pass_value = '';

  public url: SafeUrl;
  public odoo_login = true;
  public odoo_connect = false;

  public loading = false;

  public alert = '';

  constructor(private sanitizer: DomSanitizer, private json: JsonService) {}

  public ngOnInit(): void {
    document.addEventListener('deviceready', this.onDeviceReady, false);

    this.logData();
  }

  public onDeviceReady(): void {
    console.log('Device is Ready');

    this.logData();
  }

  public logData(): void {
    this.odoo_url_value = window.localStorage.getItem('url');
    this.odoo_db_value = window.localStorage.getItem('db');
    this.odoo_user_value = window.localStorage.getItem('user');
    this.odoo_pass_value = window.localStorage.getItem('pass');
  }

  public logIn(): void {
    const server_url = this.odoo_url.nativeElement.value;
    const db = this.odoo_db.nativeElement.value;
    const user = this.odoo_user.nativeElement.value;
    const pass = this.odoo_pass.nativeElement.value;

    this.odoo_url_value = server_url;
    this.odoo_db_value = db;
    this.odoo_user_value = user;
    this.odoo_pass_value = pass;

    window.localStorage.setItem('url', server_url);
    window.localStorage.setItem('db', db);
    window.localStorage.setItem('user', user);
    window.localStorage.setItem('pass', pass);

    if (db !== '') {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(server_url + '/web/app?db=' + db + '&login=' + user +
      '&password=' + pass);
    } else {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(server_url + '/web/app?login=' + user + '&password=' + pass);
    }
    this.odoo_login = false;
    this.odoo_connect = true;
  }

  public logOut(): void {
    this.odoo_connect = false;
    this.odoo_login = true;
    this.url = '';
  }

  public validate(): void {
    this.alert = '';
    this.loading = true;
    const server_url = this.odoo_url.nativeElement.value;
    const db = this.odoo_db.nativeElement.value;
    const user = this.odoo_user.nativeElement.value;
    const pass = this.odoo_pass.nativeElement.value;

    const regex = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\
    .[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\
    .[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})');

    this.json.getOdooData(server_url).subscribe((res: any) => {
      this.loading = false;

      if (server_url === '' || user === '' || pass === '') {
        this.alert = 'Data with (*) is required';
      } else if (!server_url.match(regex)) {
        this.alert = 'Need to be a valid URL';
      } else if (res.status !== 'OK') {
        this.alert = 'Odoo App Connector has Errors';
      } else {
        this.logIn();
      }
    },
    (err) => {
      this.loading = false;

      console.log(err);
      this.alert = 'Odoo Server need Oddo App Connector Module';
    });
  }
}
