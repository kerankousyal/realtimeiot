import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';
import { Subscription } from "rxjs/Subscription";

import { WebSocketService } from './shared/services/websocket.service';

import CanvasJS from './canvasjs.min';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  implements OnInit {

  connected: Subscription;
  isConnected = false;

  address: any = 'wss://bluzone.io/consumer/pws/scan?blufiId=50590'; //53204
  message: any = 'Hello World!';

  messages: Subject<any>;

  messageLog: any;

  scrollEndNow = false;
  chart;
    dataPoints = [];
    dpsLength = 0;

  @ViewChild('console') console: ElementRef;

  constructor(private _websocket: WebSocketService) {

    this.connected = _websocket.connected().subscribe(status => {
      this.isConnected = status;
      console.log('status', status);
      // this._changeDetectorRef.detectChanges()
    });
  }
  ngOnInit() {
      this.chart = new CanvasJS.Chart("chartContainer",{
          exportEnabled: false,
          /*axisX: {
              interval: 3,
              intervalType: "seconds",
              valueFormatString: "HH:mm:ss"
          },*/
          axisY: {
              title: "Temperature (in °C)",
              includeZero: false,
              suffix: " °C"
          },
          title:{
              text:"Live Chart"
          },
          data: [{
              name: "Kiran s Beacon 1",
              showInLegend: true,
              yValueFormatString: "#0.## °C",
              type: "spline",
              dataPoints : this.dataPoints,
          }]
      });
  }

  connect() {
    this.messages = <Subject<any>>this._websocket
      .connect(this.address)
      .map((response: MessageEvent): any => {
        console.log(JSON.parse(response.data)['time']);

          this.dataPoints.push({x: JSON.parse(response.data)['time'], y: JSON.parse(response.data)['temp']});
          // new Date(JSON.parse(response.data)['timestamp']).toLocaleTimeString().split(' ')[0]
          this.dpsLength = this.dataPoints.length;
          this.chart.render();
          this.updateChart(JSON.parse(response.data)['time'], JSON.parse(response.data)['temp']);

        //return response.data;
      });

      console.log(this._websocket);


    this.messageLog = this.messages.scan((current, change) => {
      this.scrollEnd();
      return [...current, `RESPONSE: ${change}`]
      }, []);

    // this.messages.next(`CONNECT: ${this.address}`);
  }

    updateChart(time, temp) {


                this.dataPoints.push({
                    x: parseInt(time),
                    y: parseInt(temp)
                });
                this.dpsLength++;


            if (this.dataPoints.length >  20 ) {
                this.dataPoints.shift();
            }
            this.chart.render();
          //  setTimeout(function(){this.updateChart(data)}, 1000);

    }

    msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return hrs + ':' + mins + ':' + secs + '.' + ms;
    }


  scrollEnd() {
    setTimeout( () => {
      this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
    }, 100);
  }
}
