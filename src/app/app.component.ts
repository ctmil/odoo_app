import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  public is_loader = false;

  public alert = '';

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnInit(): void {}

  public logIn(): void {
    const server_url = this.odoo_url.nativeElement.value;
    const db = this.odoo_db.nativeElement.value;
    const user = this.odoo_user.nativeElement.value;
    const pass = this.odoo_pass.nativeElement.value;

    this.odoo_url_value = server_url;
    this.odoo_db_value = db;
    this.odoo_user_value = user;
    this.odoo_pass_value = pass;

    const regex = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\
    .[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\
    .[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})');

    if (server_url !== '') {
      if (server_url.match(regex)) {
        if (db !== '') {
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(server_url + '/web/app?db=' + db + '&login=' + user +
          '&password=' + pass);
        } else {
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(server_url + '/web/app?login=' + user + '&password=' + pass);
        }
        this.odoo_login = false;
        this.is_loader = true;
        this.odoo_connect = true;
      } else {
        this.alert = 'You have to insert a valid URL';
      }
    } else {
      this.alert = 'You have to insert an URL';
    }
  }

  public logOut(): void {
    this.is_loader = false;
    this.odoo_connect = false;
    this.odoo_login = true;
    this.url = '';
  }
}
