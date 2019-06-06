import { Component, ViewChild, ElementRef } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';
import { Subscription } from "rxjs/Subscription";

import { WebSocketService } from './shared/services/websocket.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {

  connected: Subscription;
  isConnected = false;

  address: any = 'wss://bluzone.io/consumer/pws/scan?blufiId=50590';
  message: any = 'Hello World!';

  messages: Subject<any>;

  messageLog: any;

  scrollEndNow = false;


  @ViewChild('console') console: ElementRef;

  constructor(private _websocket: WebSocketService) {
    this.connected = _websocket.connected().subscribe(status => {
      this.isConnected = status;
      console.log('status', status);
      // this._changeDetectorRef.detectChanges()
    });
  }

  connect() {
    this.messages = <Subject<any>>this._websocket
      .connect(this.address)
      .map((response: MessageEvent): any => {
        console.log(response);
        return response.data;
      });

      console.log(this._websocket);


    this.messageLog = this.messages.scan((current, change) => {
      this.scrollEnd();
      return [...current, `RESPONSE: ${change}`]
      }, []);

    // this.messages.next(`CONNECT: ${this.address}`);
  }

  send() {
    console.log('this.messageLog', this.messageLog);
    // this.messageLog = [...this.messageLog, 'SENT: ' + this.message];
    this.messages.next(this.message);
  }

  onMessageKeyup(event) {
    if (event.keyCode === 13) {
      this.send(); 
    }
    console.log(event);
  }


  scrollEnd() {
    setTimeout( () => {
      this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
    }, 100);
  }
}
