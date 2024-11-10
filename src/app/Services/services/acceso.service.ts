import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../../Settings/Settings';
import { Usuario } from '../../Interfaces/Usuario';
import { Observable, tap } from 'rxjs';
import { ResponseLogin } from '../../Interfaces/ResponseLogin';
import { Login } from '../../Interfaces/Login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private BaseUrl: string = settings.apiUrl;
  private authToken: string = "AuthToken";

  constructor() { }

  registrarse(objeto: Usuario): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>(`${this.BaseUrl}auth/register`, objeto);
  }

  Login(objeto: Login): Observable<ResponseLogin> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ResponseLogin>(`${this.BaseUrl}auth/login`, objeto, { withCredentials: true }).pipe(
      tap(responsed => {
        if (responsed.token) {
          console.log(responsed.token);
          this.setToken(responsed.token);
        } else {
          alert("Ocurrió un error");
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.authToken, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.authToken);
  }

  isAuth(): boolean {
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

  logout() {
    localStorage.removeItem(this.authToken);
    this.router.navigate(["register"]);
  }
}