import { Component, inject } from '@angular/core';
import { AccesoService } from '../../Services/services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Usuario } from '../../Interfaces/Usuario';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Corregido styleUrl a styleUrls
})
export class RegisterComponent {
  
  private accessService = inject(AccesoService);
  private router = inject(Router);
  private form = inject(FormBuilder);

  public FormRegister: FormGroup = this.form.group({
    username: ["", Validators.required],
    mail: ["", Validators.required],
    password: ["", Validators.required]
  });
  gotologin(){
    this.router.navigate([""])
  }
  register() {
    if (this.FormRegister.invalid) {
      return;
    }
    
    const user: Usuario = {
      username: this.FormRegister.value.username,
      mail: this.FormRegister.value.mail,
      password: this.FormRegister.value.password
    };
    
    this.accessService.registrarse(user).subscribe({
      next: (data) => {
        if (data.token.length>1) {
          this.router.navigate([""]);
        } else {
          alert("No se pudo registrar correctamente");
         
        }
      },
      error: (error) => {
        
        console.log("usuario:", this.FormRegister.value.usuario, "Contraseña:", this.FormRegister.value.password);
        
        // Opcionalmente, muestra propiedades específicas
        console.log("Error Status:", error.status);
        console.log("Error Message:", error.message);
        console.log("Error Details:", error.error);
      }
    });
  }
}
