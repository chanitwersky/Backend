import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/logIn/log-in';
import { CreateLessonComponent } from './components/createLesson/lesson';
import { AiResComponent } from './components/aiResponse/response';
import { HomeComponent } from './components/home/home';
import { HistoryComponent } from './components/history/history';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // דף הבית מפנה ללוגין
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent }, // דף הבית המרכזי
  { path: 'lesson', component: CreateLessonComponent },
  { path: 'response', component: AiResComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'admin', component: Admin }

];