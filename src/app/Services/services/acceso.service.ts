import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../../Settings/Settings';
import { Usuario } from '../../Interfaces/Usuario';
import { Observable, tap } from 'rxjs';
import { ResponseLogin } from '../../Interfaces/ResponseLogin';
import { Login } from '../../Interfaces/Login';
import exp from 'node:constants';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  private http= inject(HttpClient)
  private router= inject(Router)
  private BaseUrl:string=settings.apiUrl
  private authToken:string="AuthToken"

  constructor() { }

  registrarse(objeto:Usuario): Observable<ResponseLogin>{
    return this.http.post<ResponseLogin>(`${this.BaseUrl}auth/register`,objeto)
  }
  Login(objeto:Login): Observable<ResponseLogin>{
    return this.http.post<ResponseLogin>(`${this.BaseUrl}auth/login`,objeto,{withCredentials:true}).pipe(
      tap(responsed=>{
        if(responsed.token){  
          console.log(responsed.token)
          this.setToken(responsed.token);
          
        }
        else if(responsed.token==null){
          alert("Ocurrio un error")
        }
      },
    
      
    )
    )
    
  }
  
  private setToken(token:string): void{
    localStorage.setItem(this.authToken,token)
  }
  private getToken(): string | null{
    return localStorage.getItem(this.authToken)
  }
  isauth(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return false;
    }
  }
  
  logout(){
    localStorage.removeItem(this.authToken)
    this.router.navigate(["register"])
  }

}
