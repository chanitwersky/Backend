import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register'
import { LoginComponent } from './components/logIn/log-in';
import { CreateLessonComponent } from './components/createLesson/lesson/lesson';


export const routes: Routes = [
  { path: 'register', component:RegisterComponent },
  { path:'logIn' ,component:LoginComponent},
  { path:'createLesson' ,component:CreateLessonComponent},
  
  { path: '', redirectTo: '/register', pathMatch: 'full' } // ברירת מחדל - הולך לרישום
];