import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Persona } from 'src/environments/persona';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-comprobante',
  templateUrl: './comprobante.component.html',
  styleUrls: ['./comprobante.component.scss']
})
export class ComprobanteComponent implements OnInit {

  // trackBuscado = '59f24096d7a165f14b956253cd624be6';
  trackBuscado!: String;
  listaPersona!: [Persona];
  registerForm!: FormGroup; // No provee una inicialización
  comprobante!: String;

  constructor(private route: ActivatedRoute, private servicio: FirebaseService, private formBuilder: FormBuilder, private router: Router) {
    this.route.params.subscribe(params => {
      this.trackBuscado = params['id'];
    });
  }

  private buildForm() {
    // Enviar todos los campos con sus validaciones
    this.registerForm = this.formBuilder.group({
      // Creamos cada uno de los controladores
      imagen: new FormControl(null, [Validators.required, Validators.pattern(/\.(jpeg|jpg|gif|png)$/)]),
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.consultar();
  }

  consultar() {
    this.servicio.verTodo().subscribe(res => {
      this.listaPersona = res;
      console.log(this.listaPersona)
    },
      (err) => console.log(err)
    );
  }

  editable!: boolean;

  ngOnChanges(changes: SimpleChanges) {
    // actualizar propiedades y/o llamar a metodo para refrescar
    this.consultar();
  }

  save(event: Event) {
    event.preventDefault();
    if (this.registerForm.valid) {
      this.router.navigate(['/transacciones']);

    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  subirComprobante(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result !== null) {
        const imagen = reader.result.toString();
        this.comprobante = imagen;
      }
    }
  }

  enviarComprobante(id: number) {
    Swal.fire({
      title: '¿Seguro que quiere enviar el comprobante?',
      text: "Este mensaje es una confirmación, no se podrá modificar más adelante.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, enviar comprobante',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.enviarComprobante(id, this.comprobante).subscribe(res => {
          this.consultar();
          Toast.fire({
            icon: 'success',
            title: 'El comprobante se ha enviado con éxito'
          })
        },
          (err) => {
            Toast.fire({
              icon: 'error',
              title: 'El archivo debe ser como máximo de 1MB'
            })
            console.log(err);
          }
        );
      }
    });
    this.registerForm.reset();
  }

  get imageCtrol() {
    return this.registerForm.get('imagen');
  }
}
