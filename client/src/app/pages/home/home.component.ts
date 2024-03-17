import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  userData: any;
  loginData: any = { password: '', email: '', role: '' };

  constructor(private apiService: ApiService, private router: Router ) {}

  doLogin() {
    console.log('running do login');
    if (this.loginData.email == '') {
      alert('Email can not be blank');
      return;
    } else if (this.loginData.password == '') {
      alert('password can not be blank');
      return;
    } else if (this.loginData.role == '') {
      alert('Role can not be blank');
      return;
    } else {
      this.apiService.login(this.loginData).subscribe((data: any[]) => {
        this.userData = data;
        console.log(this.userData, "userdata")
        console.log(this.userData.data._id);
        if (this.userData.message === 'success') {
          localStorage.setItem("userData", JSON.stringify(this.userData.data));
          localStorage.setItem("token", JSON.stringify(this.userData.token));
          this.router.navigate(['/admin']);
        } else {
          alert(this.userData.message);
        }
      });
    }
  }
}
