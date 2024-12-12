import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentView: 'login' | 'register' = 'login';

  toggleView(view: 'login' | 'register') {
    this.currentView = view;
  }

  userData: any;
  loginData: any = { password: '', email: '', role: '' };
  registerData: any = { username: '', password: '', email: '', role: '' };

  constructor(private apiService: ApiService, private router: Router ) {}

  doLogin() {
    this.apiService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  doRegister() {
    this.apiService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
}
