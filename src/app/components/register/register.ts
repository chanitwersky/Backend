import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms'; // חשוב עבור ה-HTML
import { AuthService } from '../../service/user/auth.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  // אובייקט שמחזיק את נתוני הטופס
  signUpForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^05\\d{8}$')]),
    password: new FormControl('', [
      Validators.required, 
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}')
    ])
  });

  constructor(private authService: AuthService, private router: Router) {}

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
        this.router.navigate(['/logIn']); 
      },
      error: (err) => {
        if (err.status === 400) {
          alert(err.error.message || 'המשתמש כבר קיים במערכת');
        } else {
          alert('שגיאת שרת פנימית, נסו שוב מאוחר יותר');
        }
        console.error('שגיאת רישום:', err);
      }
    });
  }
}
}
