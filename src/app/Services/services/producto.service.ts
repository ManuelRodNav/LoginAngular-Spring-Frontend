import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../../Settings/Settings';
import { Observable } from 'rxjs';
import { ResponseProducto } from '../../Interfaces/ResponseProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private hhtp=inject(HttpClient)
  private baseurl:string=settings.apiUrl
  constructor() { }
  listar(): Observable<ResponseProducto>{
    return this.hhtp.get<ResponseProducto>(`${this.baseurl}/Publicacion`)
  }
}
