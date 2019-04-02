import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-odoo-player',
  templateUrl: './odoo-player.component.html',
  styleUrls: ['./odoo-player.component.scss']
})
export class OdooPlayerComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('url') url = '';
  @Output() log = new EventEmitter();
  @ViewChild('iframe') iframe = ElementRef;

  constructor() { }

  public ngOnInit(): void {}

  public logOut(): void {
    this.log.emit();
  }

  public devMode(): void {}

}
