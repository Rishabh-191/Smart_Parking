import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent {
  selectedCamera: any=0;

  selectCam(num: any){
   this.selectedCamera = num;
  }

}

