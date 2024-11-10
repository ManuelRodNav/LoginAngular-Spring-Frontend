import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../../Settings/Settings';
import { Usuario } from '../../Interfaces/Usuario';
import { Observable, tap } from 'rxjs';
import { ResponseLogin } from '../../Interfaces/ResponseLogin';
import { Login } from '../../Interfaces/Login';
import { Router } from '@angular/router';
import { catchError,throwError } from 'rxjs';
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
    return this.http.post<ResponseLogin>(`${this.BaseUrl}auth/login`, objeto, { headers, withCredentials: true }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        } else {
          console.error("Error: Token no recibido en la respuesta");
        }
      }),
      catchError(error => {
        console.error("Error en la autenticación:", error);
        alert("Error en el inicio de sesión. Verifique sus credenciales.");
        return throwError(error);
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
      const exp = payload.exp * 1000; // Convertir la expiración a milisegundos
      return Date.now() < exp;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.authToken);
    this.router.navigate(["register"]);
  }
}