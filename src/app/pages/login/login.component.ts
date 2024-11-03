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
iniciarSesion(){
  if(this.formLogin.invalid){
    return ;
  }
  const objeto:Login={
    usuario: this.formLogin.value.usuario,
    password: this.formLogin.value.password
  }
  this.accesoservice.Login(objeto).subscribe({
    next:(data)=>{
      if(data.isSucces){
        console.log(data.token
        )
        localStorage.setItem("token", data.token)
        this.router.navigate(["Home"])
      }
      else{
        alert("Credenciales no validas")
      }
      
    },
    error:(error)=>{
      console.log(error + "usuario:" + this.formLogin.value.usuario + " Contraseña:" + this.formLogin.value.password  )
    }
  })
}
}
