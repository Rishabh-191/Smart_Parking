import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  userData: any={
    username:'',
    password:'',
    email:'',
    role:'',
    booking: ''
  };
  userid: any;
  constructor(private router: Router) { }

  selected: any=0;

  ngOnInit(){

    if(localStorage.getItem("userData")){

      this.userData = localStorage.getItem("userData")
      
      this.userData = JSON.parse(this.userData);
      console.log(this.userData._id)
      if(this.userData.role=='user'){
        this.router.navigate(['/booking']);
      }
    }else{
      this.router.navigate(['/home']);
    }
    
  }

  onSelect(comp: any){
      this.selected=comp;
      //if(comp==0){this.router.navigate(['/admin/parking']);}
      if(comp==1){this.router.navigate(['/admin/parking1']);}
      if(comp==2){this.router.navigate(['/admin/scanner']);}
      if(comp==3){this.router.navigate(['/admin/scannerout']);}
      if(comp==4){this.router.navigate(['/admin/booking']);}
      if(comp==5){this.router.navigate(['/admin/monitor']);}
      if(comp==6){this.router.navigate(['/admin/controlgate']);}

  }

  clearLocalStorage(){
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}
