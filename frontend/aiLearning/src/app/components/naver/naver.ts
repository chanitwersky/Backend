import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from "../../service/user/auth.service"

@Component({
  selector: 'app-naver',
  imports: [CommonModule],
  templateUrl: './naver.html',
  styleUrl: './naver.css',
})

export class NavbarComponent implements OnInit {

  userRole!: string | null;
  userName!: string | null;

  constructor(private authService:AuthService, private router: Router) {}

  ngOnInit() {
  
    this.userRole = localStorage.getItem('role');
    this.userName = localStorage.getItem('userName');

    this.authService.userRole$.subscribe(role => {
    this.userRole = role;
  });
  
  this.authService.userName$.subscribe(name => {
    this.userName = name;
  });
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.authService.clearUserStatus();
    this.router.navigate(['/login']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']); 
  }

  goToHome() { this.router.navigate(['/home']); }

  goToLesson() { this.router.navigate(['/lesson']); }
  
  goToHistory() { this.router.navigate(['/history'])}; 
 
  }

