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
  chart1;
  dataPoints1 = [];
  dpsLength1 = 0;

  @ViewChild('console') console: ElementRef;

  constructor(private _websocket: WebSocketService) {

      this.connect();
    this.connected = _websocket.connected().subscribe(status => {
      this.isConnected = status;
      console.log('status', status);
      // this._changeDetectorRef.detectChanges()
    });
  }
  ngOnInit() {
      this.chart = new CanvasJS.Chart("chartContainer",{
          exportEnabled: false,
          axisX: {
             //interval: 3,
             // intervalType: "seconds",
             // xValueFormatString: "DDD HH:mm:ss"
              //labelFormatter: function (e) {
              //    return CanvasJS.formatDate( e.value, "H:mm:ss");
              //},
              valueFormatString: "HH:mm:ss"
          },
          axisY: {
              title: "Temperature (in °C)",
              includeZero: false,
              suffix: " °C"
          },
          title:{
              text:"Current Status"
          },
          data: [{
              name: "Kiran s Beacon 1",
              showInLegend: true,
              yValueFormatString: "#0.## °C",
              type: "spline",
             xValueType: "dateTime",
              dataPoints : this.dataPoints,
          }]
      });

      this.chart1 = new CanvasJS.Chart("chartContainer1",{
          exportEnabled: false,
          title: {
              text: "RSSI signal / Date time"
          },
          axisX: {
              //intervalType: "hour",
              valueFormatString: "HH:mm:ss",
              labelMaxWidth: 100, // change label width accordingly
          },
          axisY: {
              title: "RSSI Value"
          },
          data: [{
              name: "Kiran s Beacon 1",
              showInLegend: true,
             // yValueFormatString: "#0.## °C",
              type: "spline",
              xValueType: "dateTime",
              dataPoints : this.dataPoints1,
          }]
      });
  }

  connect() {
    this.messages = <Subject<any>>this._websocket
      .connect(this.address)
      .map((response: MessageEvent): any => {
        console.log(JSON.parse(response.data)['rssi']);

          this.dataPoints.push({x: new Date(JSON.parse(response.data)['timestamp']), y: JSON.parse(response.data)['temp']});
          this.dpsLength = this.dataPoints.length;
          this.chart.render();
          this.updateChart(new Date(JSON.parse(response.data)['timestamp']), JSON.parse(response.data)['temp']);

          this.dataPoints1.push({x: new Date(JSON.parse(response.data)['timestamp']), y: JSON.parse(response.data)['rssi']});
          this.dpsLength1 = this.dataPoints1.length;
          this.chart1.render();
          this.updateChart1(new Date(JSON.parse(response.data)['timestamp']), JSON.parse(response.data)['rssi']);

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

    updateChart1(time, rssi) {


        this.dataPoints1.push({
            x: parseInt(time),
            y: parseInt(rssi)
        });
        this.dpsLength1++;


        if (this.dataPoints1.length >  20 ) {
            this.dataPoints1.shift();
        }
        this.chart1.render();
        //  setTimeout(function(){this.updateChart(data)}, 1000);

    }


  scrollEnd() {
    setTimeout( () => {
      this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
    }, 100);
  }
}
