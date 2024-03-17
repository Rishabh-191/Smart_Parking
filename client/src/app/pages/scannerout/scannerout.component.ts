import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Constants } from '../../constants';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-scannerout',
  templateUrl: './scannerout.component.html',
  styleUrls: ['./scannerout.component.css'],
})
export class ScanneroutComponent {
  apiStatus: any;
  bookingData: any = {
    _id: '',
    registration: '',
    parkingid: '',
    slot: '',
    createdAt: '',
    updatedAt: '',
  };
  wsUrl = Constants.WEBSOCKET_URL;
  websocket: any;
  websocketStatus: string = '';
  lastMessage: any;

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
    // canvasStyles: [
    //   { /* layer */
    //     lineWidth: 1,
    //     fillStyle: '#00950685',
    //     strokeStyle: '#00950685',
    //   },
    //   { /* text */
    //     font: '17px serif',
    //     fillStyle: '#ff0000',
    //     strokeStyle: '#ff0000',
    //   }
    // ],
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  public percentage = 80;
  public quality = 100;

  constructor(
    private qrcode: NgxScannerQrcodeService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.websocket = new WebSocket(this.wsUrl);
    this.websocket.onopen = () => {
      this.websocketStatus = 'Connected';
      console.log('websocket is:', this.websocketStatus);
    };

    this.websocket.onerror = (error: any) => {
      console.error('WebSocket Error:', error);
    };

    this.websocket.onclose = () => {
      this.websocketStatus = 'Disconnected';
      // You can handle reconnection logic here if needed
    };
  }

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      this.websocket.onmessage = (event: any) => {
        console.log('websocket message received', event.data);
        this.lastMessage = JSON.parse(event.data);

        if (this.lastMessage.event == 'gate') {
          console.log('websocket event is gate');
          if (this.lastMessage.data == 'open_gate_exit') {
            console.log('websocket gate event message is open_gate_exit');
            const playDeviceFacingBack = (devices: any[]) => {
              // front camera or back camera check here!
              const device = devices.find((f) =>
                /back|rear|environment/gi.test(f.label)
              );
              this.action.playDevice(
                device ? device.deviceId : devices[0].deviceId
              );
            };

            this.action['start'](playDeviceFacingBack).subscribe(
              (r: any) => console.log('start', r),
              alert
            );
          } else if (this.lastMessage.data == 'close_gate_exit') {
            console.log('websocket gate event message is close_gate_exit');
            this.action['stop']().subscribe(
              (r: any) => console.log('stop', r),
              alert
            );
          }
        }
      };
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    action['stop']().subscribe((r: any) => console.log('stop', r), alert);

    console.log(e[0].value, 'qqqqqqqqqqqqqqqqqqqqq');
    const bookingid: any = e[0].value;

    if (this.isValidMongoObjectId(bookingid)) {
      console.log('Valid MongoDB ObjectId');
      this.apiService.getBookingById(bookingid).subscribe((data: any[]) => {
        this.bookingData = data;
        if (this.bookingData.message == 'success') {
          console.log('found booking id: ', bookingid);
          console.log(this.bookingData.data.slot, 'related slot of the');

          this.apiService
            .updateParking({ [this.bookingData.data.slot]: 'vacant' })
            .subscribe((data: any[]) => {
              console.log('parking status updated');
            });

          this.apiService.deleteBooking(bookingid).subscribe((data: any[]) => {
            this.apiStatus = data;

            if (this.apiStatus.message == 'success') {
              console.log('booking deleted');

              const storedTime = this.apiStatus.data.reservetime;
              const currentTime = new Date();

              // const difference = currentTime.getTime() - storedTime.getTime();
              // const differenceM = difference / (1000 * 60);

              // console.log(differenceM, "difference in minutes")

              // if(differenceM > 0)

              this.apiService
                .updateBalance({ balanceCut: 200 }, this.apiStatus.data.userid)
                .subscribe((data: any) => {
                  this.apiStatus = data;
                  if (this.apiStatus.message == 'success') {
                    console.log('balance updated');
                    this.websocket.send('{"event":"gate_open_exit_command"}');
                  } else {
                    console.log('error in api call');
                  }
                });
            } else {
              console.log('error in api call');
            }
          });
        } else {
          alert('No booking available');
        }
      });
    } else {
      console.log('Invalid MongoDB ObjectId');
      alert('Invalid booking reference');
    }
  }

  public handle(action: any, fn: string): void {
    console.log(fn, 'valueeeeeeeee', action);
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      ); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onDowload(action: NgxScannerQrcodeComponent) {
    action.download().subscribe(console.log, alert);
  }

  public onSelects(files: any) {
    this.qrcode
      .loadFiles(files, this.percentage, this.quality)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
  }

  public onSelects2(files: any) {
    this.qrcode
      .loadFilesToScan(files, this.config, this.percentage, this.quality)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        console.log(res);
        this.qrCodeResult2 = res;
      });
  }

  public onGetConstraints() {
    const constrains = this.action.getConstraints();
    console.log(constrains);
  }

  public applyConstraints() {
    const constrains = this.action.applyConstraints({
      ...this.action.getConstraints(),
      width: 510,
    });
    console.log(constrains);
  }

  /////////////////////////
  isValidMongoObjectId(id: string): boolean {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  }
}
