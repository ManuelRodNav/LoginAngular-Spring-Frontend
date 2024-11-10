import { Component, inject } from '@angular/core';
import { AccesoService } from '../../Services/services/acceso.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { Login } from '../../Interfaces/Login';
import { error } from 'console';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
private accesoservice= inject(AccesoService)
private router= inject(Router)
private formBuild= inject(FormBuilder)

public formLogin:FormGroup= this.formBuild.group({
  usuario:["",Validators.required],
  password:["",Validators.required]
})

linktoregister(){
this.router.navigate(["register"])
}
iniciarSesion(): void {
  if (this.formLogin.invalid) {
    return console.log("Ocurrio un error con el formulario");
  }
  
  const objeto: Login = {
    usuario: this.formLogin.value.usuario,
    password: this.formLogin.value.password
  };
  
  this.accesoservice.Login(objeto).subscribe({
    next: (data) => {
      if (data.token.length>1) {  
        console.log("Token recibido:", data.token);
        localStorage.setItem("token", data.token);
        this.router.navigate(["Home"]);
      } else {
        alert("Credenciales no válidas");
      }
    },
    error: (error) => {
      console.error("Error en el login:", error); // Muestra el objeto completo
      console.log("usuario:", this.formLogin.value.usuario, "Contraseña:", this.formLogin.value.password);
      
      // Opcionalmente, muestra propiedades específicas
      console.log("Error Status:", error.status);
      console.log("Error Message:", error.message);
      console.log("Error Details:", error.error);
    }
  });
}
}
