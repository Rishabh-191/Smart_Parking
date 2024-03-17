import { Component, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import io from 'socket.io-client';

//const socket = io('http://192.168.64.12:3000');

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.css']
})
export class ParkingComponent {

  constructor(private apiService: ApiService, private ngZone: NgZone){}

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
   
      this.getParking()
    //   socket.on('hello',(data)=>{

    //     this.ngZone.run(() => {
    //       this.getParking();
    //   });
      
    // })
  }

  getParking(){
    this.apiService.getParking().subscribe((data: any[]) => {
      this.parkingData = data;
    });
  }
  
}
