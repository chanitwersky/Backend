import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/user/auth.service'; // ודאי שהנתיב ל-Service נכון
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LoginComponent {

    private authService = inject(AuthService);
  // ב-Login אנחנו צריכים רק טלפון וסיסמה
    loginForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^05\\d{8}$')]),
    password: new FormControl('', [Validators.required])
  });

  constructor( private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res:any) => {
          console.log('התחברות הצליחה!', res);
          this.authService.setUserData(res);
          alert('ברוך הבא!');
          this.router.navigate(['/dashboard']); // או לאן שתרצי להפנות אחרי לוגין
        },
        error: (err:Error) => {
          console.error('שגיאה בהתחברות:', err);
          alert('מספר טלפון או סיסמה שגויים');
        }
      });
    }
  }
}