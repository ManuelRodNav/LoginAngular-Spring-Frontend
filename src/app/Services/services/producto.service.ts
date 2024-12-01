import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../../Settings/Settings';
import { Observable, tap } from 'rxjs';
import { ResponseProducto } from '../../Interfaces/ResponseProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private http = inject(HttpClient);
  private baseurl: string = settings.apiUrl;

  // Método para obtener el encabezado dinámicamente
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<ResponseProducto> {
    return this.http.get<ResponseProducto>(`${this.baseurl}api/publicacion/all`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        if (response) {
          console.log("Datos recuperados:", response.contenidos);
        } else {
          console.error("Error: No se ha podido recuperar los datos o el formato de la respuesta es incorrecto");
        }
      }),
    );
  }
}
