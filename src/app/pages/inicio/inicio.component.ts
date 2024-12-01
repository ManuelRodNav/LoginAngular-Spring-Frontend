import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../Services/services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  private productService = inject(ProductoService);
  public products: any[] = []; 
  
  ngOnInit(): void {
      this.getProducts();
  }

  getProducts(): void {
    this.productService.listar().subscribe({
      next: (data) => {
        this.products = [...this.products, ...data.contenidos]; // Actualizar correctamente la lista
        console.log("Productos cargados:", this.products);
      },
      error: (error) => {
        console.error("Error al cargar productos:", error);
        alert("Error: " + error.message);
        console.log("Token en localStorage:", localStorage.getItem("token"));
      }
    });
  }
}
