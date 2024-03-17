import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ParkingComponent } from './pages/parking/parking.component';
import { Parking1Component } from './pages/parking1/parking1.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { ScanneroutComponent } from './pages/scannerout/scannerout.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ControlgateComponent } from './pages/controlgate/controlgate.component';
import { MonitorComponent } from './pages/monitor/monitor.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'xxx', component: ControlgateComponent },
   
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'parking', component: ParkingComponent },
      { path: 'parking1', component: Parking1Component },
      { path: 'scanner', component: ScannerComponent },
      { path: 'scannerout', component: ScanneroutComponent },
      { path: 'booking', component: BookingComponent },
      { path: 'monitor', component: MonitorComponent },
      { path: 'controlgate', component: ControlgateComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
