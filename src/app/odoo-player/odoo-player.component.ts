import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-odoo-player',
  templateUrl: './odoo-player.component.html',
  styleUrls: ['./odoo-player.component.scss']
})
export class OdooPlayerComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('url') url: SafeUrl;
  // tslint:disable-next-line: no-input-rename
  @Input('server') server = '';
  // tslint:disable-next-line: no-input-rename
  @Input('db') db = '';
  // tslint:disable-next-line: no-input-rename
  @Input('user') user = '';
  // tslint:disable-next-line: no-input-rename
  @Input('pass') pass = '';
  @Output() log = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) { }

  public ngOnInit(): void {}

  public logOut(): void {
    this.log.emit();
  }

  public devMode(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.server + '/web/app?db=' + this.db + '&login=' + this.user +
    '&password=' + this.pass + '&debug=true');
  }

}
