import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../service/user/auth.service'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LoginComponent {

    private authService = inject(AuthService);
  
    loginForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.pattern('^\\d{9}$')]),
    password: new FormControl('', [Validators.required])
  });

  constructor( private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log('התחברות הצליחה!', res);
        const userData = res.user;
        localStorage.setItem('token', res.token); 
        localStorage.setItem('role', userData.role); 
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userId', userData.id ); 
        this.authService.updateUserStatus();
        // alert('ברוך הבא!');
        
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('שגיאה בהתחברות:', err);
        alert('מספר זהות או סיסמה שגויים');
      }
    });
    }
  }
  goToRegister() {
    this.router.navigate(['/register']); 
  }
}