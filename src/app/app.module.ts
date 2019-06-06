import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatIconModule } from '@angular/material';

import { WebSocketService } from './shared/services/websocket.service';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

//import * as PlotlyJS from 'plotly.js/dist/plotly.js';
//import { PlotlyModule } from 'angular-plotly.js';

//PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  //  PlotlyModule
  ],
  declarations: [ 
    AppComponent
  ],
  providers: [
    WebSocketService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
