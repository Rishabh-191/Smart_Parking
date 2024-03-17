import { Component } from '@angular/core';
import { Constants } from '../../constants';

@Component({
  selector: 'app-controlgate',
  templateUrl: './controlgate.component.html',
  styleUrls: ['./controlgate.component.css']
})
export class ControlgateComponent {
  rect="#a9a9a9";
  rects="#038464"
  wsUrl = Constants.WEBSOCKET_URL;
  websocket: any;
  websocketStatus: string='';
  lastMessage: any;

  ngOnInit(){
    this.websocket = new WebSocket(this.wsUrl);
    this.websocket.onopen = () => {
      this.websocketStatus = 'Connected';
    };
    this.websocket.onmessage = (event: any) => {
      //this.lastMessage=event.data;
      this.lastMessage = JSON.parse(event.data);
    
    };

  }

  openfront(){
    console.log("tttttttttt")
    this.websocket.send('{\"event\":\"gate_open_front\"}');
  }
  closefront(){
    console.log("tttttttttt")
    this.websocket.send('{\"event\":\"gate_close_front\"}');
  }
  closeback(){
    console.log("tttttttttt")
    this.websocket.send('{\"event\":\"gate_close_back\"}');
  }
  openback(){
    console.log("tttttttttt")
    this.websocket.send('{\"event\":\"gate_open_back\"}');
  }
 
 



}
