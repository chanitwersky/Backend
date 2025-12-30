import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { Create } from '../../../service/lesson/create';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/user/auth.service';

@Component({
  selector: 'app-lesson',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lesson.html',
  styleUrl: './lesson.css',
})
export class CreateLessonComponent implements OnInit {
  loginForm: FormGroup;
  categories: any[] = [];
  subCategories: any[] = [];
  userId:any;

  constructor(
    private fb: FormBuilder,
    private createService: Create, 
    private authService: AuthService,
    private router: Router
  ) {
    
    this.loginForm = this.fb.group({
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      additionalText: ['', Validators.required]
    });
  }

  ngOnInit() {

    const user = this.authService.getUserData();
      
      this.userId = user.id; 
      console.log('המזהה של המשתמש המחובר:', this.userId);
      // שליפת הקטגוריות בטעינת הדף
      this.createService.showCategories({}).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('שגיאה בטעינת קטגוריות', err)
    });
  }

  onCategoryChange() {
    const selectedId = this.loginForm.get('categoryId')?.value;
    const selectedCat = this.categories.find(c => c.id == selectedId);
    
    this.subCategories = selectedCat ? selectedCat.subCategories : [];
    this.loginForm.patchValue({ subCategoryId: '' }); 
  }

  sendPrompt() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;

      const categoryName = this.categories.find(c => c.id == formValues.categoryId)?.name;
      const subCategoryName = this.subCategories.find(s => s.id == formValues.subCategoryId)?.name;

    
      const dataToSend = {
      userId:this.userId,
      categoryName: categoryName,
      subCategoryName: subCategoryName,
      additionalText: formValues.additionalText
    };
      this.createService.sendPrompt(dataToSend).subscribe({
        next: (res) => {
          this.router.navigate(['/aiRes']);
        },
        error: (err) => {
          alert('קרתה שגיאה ביצירת שיעור');
          console.error('שגיאה:', err);
        }
      });
    }
  }
}