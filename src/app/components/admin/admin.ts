import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Create } from '../../service/lesson/create';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})

export class Admin implements OnInit {

  allUserHistory: any[] = [];
  isLoading: boolean = true;

  constructor(private promptService: Create) { }

  ngOnInit() {
    this.promptService.getAllUsersWithHistory().subscribe({
      next: (res: any) => {
        console.log('המידע שהתקבל מהשרת:', res);
        this.allUserHistory = res.data;
        this.isLoading = false;

      },
      error: (err) => {
        console.error('שגיאה בטעינת נתונים:', err);
        this.isLoading = false;
      }
    });
  }
}


