import { Component, OnInit, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare var jquery: any;
declare var $: any;
declare var navigator: any;

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

  public uid = 0;
  public network = true;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2) { }

  public ngOnInit(): void {
    this.renderer.listen('document', 'offline', () => { // Check OffLine listener
      console.log('Device is Offline - Odoo player');
      console.log(navigator.connection.type);
      this.network = false;
    });

    this.renderer.listen('document', 'online', () => {  // Check OnLine listener
      console.log('Device is Online - Odoo player');
      console.log(navigator.connection.type);
      this.network = true;
    });

    this.odooConnect(this.server, this.db, this.user, this.pass);

    // Noti Test
    navigator.notification.confirm(
      'Test msg',
       this.notiDismissed,
      'This is a Test - Odoo',
      ['Ok', 'Cancel']
    );
  }

  /* XML-RCP Odoo Connect */
  public odooConnect(server: string, db: string, user: string, pass: string): void {
    const this_ = this;
    const forcedUserValue = $.xmlrpc.force('string', user);
    const forcedPasswordValue = $.xmlrpc.force('string', pass);
    const forcedDbNameValue = $.xmlrpc.force('string', db);

    $.xmlrpc({
      url: this_.server + '/xmlrpc/common',
      methodName: 'login',
      dataType: 'xmlrpc',
      crossDomain: true,
      params: [forcedDbNameValue, forcedUserValue, forcedPasswordValue],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response + ' - ' + status);
        if (response[0] !== false) {
          this_.uid = response[0];
          this_.getChannels(this_.server, this_.db, this_.user, this_.pass, this_.uid);
        } else {
          this_.logOut();
        }
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Err: ' + jqXHR + ' - ' + status + '-' + error);
        this_.logOut();
      }
    });
  }

  /* Get Channel Information */
  public getChannels(server_url: string, db: string, user: string, pass: string, uid: number): void {
    const this_ = this;

    $.xmlrpc({
      url: server_url + '/xmlrpc/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'mail.channel', 'search_read', [ [] ], {'fields': ['message_unread', 'message_ids']}],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response[0]);
        for (let index = 0; index < response[0].length; index++) {
          this_.getMsg(this_.server, this_.db, this_.user, this_.pass, this_.uid, response[0][index].message_ids[0]);
        }
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Error : ' + error );
      }
    });
  }

  /* Get Msgs Information */
  public getMsg(server_url: string, db: string, user: string, pass: string, uid: number, msg_id: number): void {
    const this_ = this;

    $.xmlrpc({
      url: server_url + '/xmlrpc/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'mail.message', 'search_read', [ [['id', '=', msg_id]] ], {'fields': ['body', 'author_id', 'display_name']}],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response);
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Error : ' + error );
      }
    });
  }

  /* Notification */
  public notiDismissed(buttonIndex: any): void {
    console.log('Notification Success ' +  buttonIndex);
  }

  public logOut(): void {
    this.log.emit();
  }

  public devMode(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.server + '/web/app?db=' + this.db + '&login=' + this.user +
    '&password=' + this.pass + '&debug=true');
  }

}
