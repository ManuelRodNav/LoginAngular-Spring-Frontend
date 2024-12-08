import { Component, inject, OnInit, signal, model } from '@angular/core';
import { ProductoService } from '../../Services/services/producto.service';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
export interface PostData{
  titulo:string,
  descripcion:string,
  id:number,
  contenido:string
}

export class DialogOverviewExample {
  readonly contenido = signal('');
  readonly id = signal('');
  readonly titulo = signal('');
  readonly descripcion = signal('');
  readonly dialog = inject(MatDialog);
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {contenido: this.contenido, id:this.id,titulo:this.titulo, descripcion:this.descripcion},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.animal.set(result);
      }
    });
  }
}
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatTableModule,MatButtonModule,MatDialogModule,MatDialogRef],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  public encabezados:string[]=["Id","Titulo","descripcion","contenido"];
  private productService = inject(ProductoService);
  private dialog= inject(MatDialog)
  public products = new MatTableDataSource<any>([]);
  
  ngOnInit(): void {
      this.getProducts();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.trim().toLowerCase();
  }

  getProducts(): void {
    this.productService.listar().subscribe({
      next: (data) => {
        this.products.data= data.contenidos // Actualizar correctamente la lista
        console.log("Productos cargados:", this.products);
      },
      error: (error) => {
        console.error("Error al cargar productos:", error);
        alert("Error: " + error.message);
        console.log("Token en localStorage:", localStorage.getItem("token"));
      }
    });
  }
  openDialog(product: PostData): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { ...product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Actualiza el producto en la tabla
        const index = this.products.data.findIndex((p) => p.id === result.id);
        if (index !== -1) {
          this.products.data[index] = result;
          this.products.data = [...this.products.data]; // Trigger change detection
        }
      }
    });
  }

}




export class DialogOverviewExampleDialog {
  public dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<PostData>(MAT_DIALOG_DATA);
 

  onNoClick(): void {
    this.dialogRef.close();
  }

}

