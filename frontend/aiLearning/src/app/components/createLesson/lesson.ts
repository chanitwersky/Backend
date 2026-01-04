import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Create } from '../../service/lesson/create';
import { AuthService } from '../../service/user/auth.service';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lesson.html',
  styleUrl: './lesson.css',
})
export class CreateLessonComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  categories: any[] = [];
  subCategories: any[] = [];
  userId: any;

  loginForm = this.fb.group({
    categoryName: ['', Validators.required],
    subCategoryName: ['', Validators.required],
    additionalText: ['', Validators.required]
  });

  constructor(
    private createService: Create,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  
    const user = this.authService.getUserData();
    if (user) {
      this.userId = user.id;
    }

    this.createService.showCategories({}).subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err: any) => console.error('שגיאה בטעינת קטגוריות', err)
    });
  }

  sendPrompt() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;

      const dataToSend = {
        category: formValues.categoryName,
        subCategory: formValues.subCategoryName,
        promptText: formValues.additionalText,
        userId: this.userId 
      };

      this.createService.sendPrompt(dataToSend).subscribe({
        next: (res: any) => {
          this.router.navigate(['/response']);
        },
        error: (err: any) => {
          alert('קרתה שגיאה ביצירת שיעור');
          console.error('שגיאה:', err);
        }
      });
    }
  }

  onCategoryInput() {
    const selectedName = this.loginForm.get('categoryName')?.value;

    this.loginForm.get('subCategoryName')?.setValue('');
    
    const selectedCat = this.categories.find(c => c.name === selectedName);

    if (selectedCat && selectedCat.learningHistory) {
      this.subCategories = selectedCat.learningHistory;

    } else {
      this.subCategories = [];
    }
  }


}