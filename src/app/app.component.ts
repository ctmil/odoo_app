import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JsonService } from './services/json.service';
import { timer } from 'rxjs';

declare var navigator: any;
declare var window: any;
declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('odoo_url', {static: false}) odoo_url: ElementRef;
  @ViewChild('odoo_db', {static: false}) odoo_db: ElementRef;
  @ViewChild('odoo_user', {static: false}) odoo_user: ElementRef;
  @ViewChild('odoo_pass', {static: false}) odoo_pass: ElementRef;
  public odoo_url_value = '';
  public odoo_db_value = '';
  public odoo_user_value = '';
  public odoo_pass_value = '';

  public url: SafeUrl;
  public odoo_login = true;
  public odoo_connect = false;
  public odoo_view = true;

  public network = true;

  public loading = false;

  public alert = '';

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2, private json: JsonService) {}

  public ngOnInit(): void {
    const this_ = this;

    this.renderer.listen('document', 'deviceready', () => { // DeviceReady listener
      console.log('Device is Ready');
      this_.logData();
    });

    this.renderer.listen('document', 'offline', () => { // Check OffLine listener
      console.log('Device is Offline');
      console.log(navigator.connection.type);
      this_.network = false;
    });

    this.renderer.listen('document', 'online', () => {  // Check OnLine listener
      console.log('Device is Online');
      console.log(navigator.connection.type);
      this_.network = true;
    });
  }

  public ngAfterViewInit(): void {
    this.logData();
  }

  public logData(): void {
    this.odoo_url_value = window.localStorage.getItem('url');
    this.odoo_db_value = window.localStorage.getItem('db');
    this.odoo_user_value = window.localStorage.getItem('user');
    this.odoo_pass_value = window.localStorage.getItem('pass');

    const secondsCounter = timer(500); // Pre-Loading

    secondsCounter.subscribe( () => {
      if (window.localStorage.getItem('url') && window.localStorage.getItem('db') &&
      window.localStorage.getItem('user') && window.localStorage.getItem('pass')) {
        this.validate();
      }
    });
  }

  public logIn(): void {
    this.loading = true;

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

    // URL - Forced use of DB
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(server_url + '/web/app?db=' + db + '&login=' + user +
    '&password=' + pass + '&debug=false');

    this.odoo_connect = true;

    const secondsCounter = timer(3000); // Pre-Loading

    secondsCounter.subscribe( () => {
      this.loading = false;
      this.odoo_login = false;
      this.odoo_view = false;
    });
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

    if (this.network) {
      this.json.getOdooData(server_url).subscribe((res: any) => {
        this.loading = false;

        if (server_url === '' || user === '' || pass === '' || db === '') {
          this.alert = 'Data with (*) is required';
        } else if (!this.network) {
          this.alert = 'You need to be connected to Internet';
        } else if (res.status !== 'OK') {
          this.alert = 'Odoo App Connector has Errors';
        } else {
          this.logIn();
        }
      },
      (err) => {
        this.loading = false;

        console.log(err);

        if (server_url.indexOf('http://') === -1 && server_url.indexOf('https://') === -1) {
          this.alert = 'Server URL need auth (http or https)';
        } else {
          this.alert = 'Odoo Server need Oddo App Connector Module';
        }
      });
    } else {
      this.loading = false;
      this.alert = 'You need to be connected to Internet';
    }
  }
}
