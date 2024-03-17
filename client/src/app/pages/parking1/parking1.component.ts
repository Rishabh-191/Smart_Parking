import { Component, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Constants } from '../../constants';

@Component({
  selector: 'app-parking1',
  templateUrl: './parking1.component.html',
  styleUrls: ['./parking1.component.css']
})
export class Parking1Component {

  constructor(private apiService: ApiService, private ngZone: NgZone){}
  wsUrl = Constants.WEBSOCKET_URL;
  websocket: any;
  websocketStatus: string='';
  lastMessage: any;

  parkingData:any={
    _id: '',
    parkingname: '',
    count: 0,
    p1: '',
    p10: '',
    p11: '',
    p12: '',
    p13: '',
    p14: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    updatedAt: ''
  }

  ngOnInit() {
    this.getParking();
    this.websocket = new WebSocket(this.wsUrl);
    this.websocket.onopen = () => {
      this.websocketStatus = 'Connected';
    };

    this.websocket.onmessage = (event: any) => {
      //this.lastMessage=event.data;
      this.lastMessage = JSON.parse(event.data);
      this.parkingData = this.lastMessage.data;
      console.log(this.parkingData,"hhhhhhhhhh")
    };

    this.websocket.onerror = (error: any) => {
      console.error('WebSocket Error:', error);
    };

    this.websocket.onclose = () => {
      this.websocketStatus = 'Disconnected';
      // You can handle reconnection logic here if needed
    };

  }

  getParking(){
    this.apiService.getParking().subscribe((data: any[]) => {
      this.parkingData = data;
    });
  }
  
}
