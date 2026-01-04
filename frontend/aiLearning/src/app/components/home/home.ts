import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common"; // חשוב עבור ה-ngIf

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class HomeComponent implements OnInit {

  userName: string | null = '';
  userRole: string | null = '';

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.userRole = localStorage.getItem('role');
  }
}