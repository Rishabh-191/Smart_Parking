import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  userData: any;
  parkingData: any = {
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
    updatedAt: '',
  };
  bookingData: any = {
    registration: '',
    parkingid: '65e9621bd0f445c63fef5e7d',
    slot: '',
    reservetime: '',
    status: '',
    userid: '',
  };
  apiStatus: any = '';
  userid: any = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('userData')) {
      this.userData = localStorage.getItem('userData');
      this.userData = JSON.parse(this.userData);
      this.userid = this.userData._id;

      this.getUserData(this.userid);
    } else {
      this.router.navigate(['/home']);
    }

    this.getParking();
  }

  slotSelect(slot: any) {
    this.bookingData.slot = slot;
  }

  getParking() {
    this.apiService.getParking().subscribe((data: any[]) => {
      this.parkingData = data;
      console.log(this.parkingData, 'parking Data');
    });
  }

  getUserData(id: any) {
    this.apiService.getUserById(id).subscribe((data: any[]) => {
      this.userData = data;
      this.userData = this.userData.data;
      console.log(this.userData, 'latest');
    });
  }

  doBooking() {
    this.apiService.getParking().subscribe((data: any[]) => {
      this.parkingData = data;
      console.log(this.parkingData.p4);

      if (this.parkingData[this.bookingData.slot] === 'vacant') {
        console.log('entering if condition');
        this.apiService
          .updateParking({ [this.bookingData.slot]: 'booked' })
          .subscribe((data: any[]) => {
            this.apiStatus = data;

            if (this.apiStatus.message == 'success') {
              console.log('booking data', this.bookingData);

              this.bookingData.status = 'booked';

              const currentTime: Date = new Date();
              currentTime.setMinutes(currentTime.getMinutes() + this.bookingData.reservetime);
              this.bookingData.reservetime = currentTime;
              this.bookingData.userid = this.userid;

              this.apiService
                .addBooking(this.bookingData)
                .subscribe((data: any[]) => {
                  console.log(data, 'uuuuuuuuuuuuuuuu');

                  this.apiStatus = data;
                  if (this.apiStatus.message === 'success') {
                    console.log('now update user');

                    this.apiService
                      .updateUser(
                        { booking: this.apiStatus.data._id },
                        this.userid
                      )
                      .subscribe((data: any[]) => {
                        this.apiStatus = data;
                        if (this.apiStatus.message == 'success') {
                          console.log(this.apiStatus, 'user updated data');

                          this.userData = this.apiStatus.data;
                        } else {
                          console.log('error updating user');
                        }
                      });
                  }
                });
            }
          });
      } else {
        alert('slot not available');
      }
    });
  }
}
