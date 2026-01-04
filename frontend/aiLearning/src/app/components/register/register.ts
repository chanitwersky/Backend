import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../service/user/auth.service'



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class RegisterComponent {

  signUpForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^05\\d{8}$')]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}')
    ]),
    role: new FormControl('user')
  });

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe({
        next: (res: any) => {

          console.log('נתוני משתמש שהתקבלו:', res.data);
          this.authService.setUserData(res.data);

          if (res.token) {
            localStorage.setItem('token', res.token);
          }

          alert('נרשמת בהצלחה!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 400) {
            alert(err.error.message || 'המשתמש כבר קיים במערכת');
            this.router.navigate(['/login']);
          } else {
            alert('שגיאת שרת פנימית, נסו שוב מאוחר יותר');
          }
          console.error('שגיאת רישום:', err);
        }
      });
    }
  }
}
