import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ParkingComponent } from './pages/parking/parking.component';
import { HttpClientModule } from '@angular/common/http';
import { Parking1Component } from './pages/parking1/parking1.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { ScanneroutComponent } from './pages/scannerout/scannerout.component';
import { BookingComponent } from './pages/booking/booking.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { ControlgateComponent } from './pages/controlgate/controlgate.component';
import { MonitorComponent } from './pages/monitor/monitor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    ParkingComponent,
    Parking1Component,
    ScannerComponent,
    ScanneroutComponent,
    BookingComponent,
    ControlgateComponent,
    MonitorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxScannerQrcodeModule,
    FormsModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
