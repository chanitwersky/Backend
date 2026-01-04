import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Create {

    private apiUrlc = 'http://127.0.0.1:5000/api/categories'; 
    private apiUrlp = 'http://127.0.0.1:5000/api/prompts';
    private apiUrlu = 'http://127.0.0.1:5000/api/users';
    

    constructor(private http: HttpClient) {}

    

    showCategories(credentials: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrlc}/categories`, credentials);
    }

    sendPrompt(credentials: any): Observable<any> {
        
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<any>(`${this.apiUrlp}/`, credentials, { headers });
    }

    
    getResponse(): Observable<any>{
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<any>(`${this.apiUrlp}/response`, { headers });
    }

    getUsersHistory(): Observable<any> {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); 
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(`${this.apiUrlp}/${userId}`, { headers });
    }

    getAllUsersWithHistory(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(`${this.apiUrlu}/history`, { headers });
    }


}

    





  
  
