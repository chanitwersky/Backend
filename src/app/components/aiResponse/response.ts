import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

import { Create } from '../../service/lesson/create';
import { marked } from 'marked';

@Component({
  selector: 'app-ai-res',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response.html',
  styleUrls: ['./response.css']
})

export class AiResComponent implements OnInit {
  answer: string = '';
  isLoading: boolean = true;

  constructor(private createService: Create, private router: Router ,private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.createService.getResponse().subscribe({
      next: (res: any) => {
        console.log('מה הגיע מהשרת?', res);

        if (res && res.data) {
          this.answer = res.data;
        } else {
          this.answer = res;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בשליפת התשובה', err);
        this.isLoading = false;
      }
    });
  }

  createNewLesson() {
    this.router.navigate(['/lesson']);
  }

  formatMarkdown(text: string) {
    const clean = text.replace(/^\s+/gm, '');
    let html = marked.parse(clean) as string;
    html = html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  
   
}