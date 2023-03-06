import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { SessionService } from '../services/session.service';

import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: any = {};

  loginForm!: FormGroup; // No provee una inicialización

  constructor(private formBuilder: FormBuilder, private router: Router, private sesion: SessionService) {
    this.ngOnInit();
  }
  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    console.log(this.loginForm.value);
    console.log("toucherd", this.loginForm.markAsTouched());
  }

  private buildForm() {
    // Enviar todos los campos con sus validaciones
    this.loginForm = this.formBuilder.group({
      // Creamos cada uno de los controladores
      passCtrol: new FormControl('', [Validators.required, Validators.minLength(7)]),
      emailCtrol: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  save(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      if (this.loginForm.value.emailCtrol === "amgoyes@espe.edu.ec" && this.loginForm.value.passCtrol === "amgoyes") {
        swalWithBootstrapButtons.fire(
          '¡Bievenido!',
          'Ha iniciado sesión correctamente.',
          'success'
        )
        this.sesion.setSession("admin", true)
        this.router.navigate(['/']);
      } else {
        swalWithBootstrapButtons.fire(
          '¡Credenciales incorrectas!',
          'No se ha podido iniciar sesión. Compruebe las crendenciales y vuelva a intentarlo.',
          'error'
        )
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get passCtrol() {
    return this.loginForm.get('passCtrol');
  }

  get emailCtrol() {
    return this.loginForm.get('emailCtrol');
  }
}
