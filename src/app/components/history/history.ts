import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

import { Create } from "../../service/lesson/create";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})

export class HistoryComponent implements OnInit {

  userHistory: any[] = [];
  isLoading: boolean = true;

  constructor(private promptService: Create,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.promptService.getUsersHistory().subscribe({
      next: (res) => {
        console.log('--- תשובה גולמית מהשרת ---', res);
        this.isLoading = false;

        if (res && res.data) {
          this.userHistory = res.data;
        } else if (Array.isArray(res)) {
          this.userHistory = res;
        } else {
          this.userHistory = res.prompts || [];
        }
      },
      error: (err) => {
        this.isLoading = false; 
      }
    });
  }


  formatMarkdown(text: string) {
    const clean = text.replace(/^\s+/gm, '');
    const html = marked.parse(clean) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}