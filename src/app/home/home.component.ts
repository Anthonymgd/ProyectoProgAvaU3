import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Persona } from '../../environments/persona';
import Swal from 'sweetalert2';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { cedulaValidatorFn } from '../services/validadorCedula';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  persona!: Persona;
  ciudades = [
    'Machala',
    'Santo Domingo de los Tsáchilas',
    'Esmeraldas',
    'Manta',
    'Portoviejo',
    'Riobamba',
    'Latacunga',
    'Ibarra',
    'Babahoyo',
    'Tulcán',
    'Tena',
    'Puyo',
    'Nueva Loja',
    'Quevedo',
  ];

  newProjectName: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private servicio: FirebaseService
  ) {
    this.buildForm();
  }

  registerForm: FormGroup<any> = null!;

  @ViewChild(ShoppingCartComponent)
  private shoppingCart!: ShoppingCartComponent;

  clearCart() {
    this.shoppingCart.animales = [];
    this.shoppingCart.calculateTotal();
    this.shoppingCart.animalSeleccionado = -1;
  }

  total!: number;
  handleAttributeChange(attribute: number) {
    this.total = attribute;
  }

  private buildForm() {
    // Enviar todos los campos con sus validaciones
    this.registerForm = this.formBuilder.group({
      // Creamos cada uno de los controladores
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      cedula: new FormControl('', [Validators.required, cedulaValidatorFn]),
      email: new FormControl('', [Validators.required, Validators.email]),
      comentario: new FormControl('', [Validators.minLength(15)]),
      residencia: new FormControl('-1', [
        Validators.required,
        this.validateResidencia,
      ]),
    });
    this.registerForm.patchValue({
      residencia: '-1',
    });
  }
  

  validateResidencia(control: AbstractControl) {
    if (control.value === '-1') {
      return { invalidResidencia: true };
    }
    return null;
  }

  
  registrarPedido() {
    if (this.registerForm.valid) {
      if (this.total > 0) {
        this.persona = new Persona(
          this.registerForm.value.nombre,
          this.registerForm.value.apellido,
          this.registerForm.value.cedula,
          this.registerForm.value.email,
          this.registerForm.value.comentario,
          this.registerForm.value.residencia,
          this.total
        );
        this.servicio.registrarPersona(this.persona).subscribe(
          (res) => {
            Swal.fire({
              title: '¡Se ha registrado el pedido correctamente!',
              text: 'Su solicitud está siendo procesada, se le enviará una notificación a su correo para continuar con el proceso.',
              icon: 'success',
              confirmButtonText: 'Continuar',
            });
            this.registerForm.reset();
            this.clearCart();
          },
          (err) => {
            console.log(err);
            Swal.fire({
              title: '¡Ha ocurrido un error en el proceso!',
              text: 'Su solicitud no ha sido procesada, intente nuevamente.',
              icon: 'error',
              confirmButtonText: 'Continuar',
            });
          }
        );
      } else {
        this.registerForm.markAllAsTouched();
        Swal.fire({
          title: '¡Ganado no seleccionado!',
          text: 'Ingrese como mínimo un animal para comprar.',
          icon: 'error',
          confirmButtonText: 'Continuar',
        });
      }
    } else {
      this.registerForm.markAllAsTouched();
      Swal.fire({
        title: '¡Complete los campos oblogatorios!',
        icon: 'error',
        confirmButtonText: 'Continuar',
      });
    }
  }

  ngOnInit() {
    this.servicio.verTodo().subscribe(
      (res) => {},
      (err) => console.log(err)
      );
    }
    
    save(event: Event) {
      event.preventDefault();
    if (this.registerForm.valid) {
      this.router.navigate(['/confirmacion']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get nombreCtrol() {
    return this.registerForm.get('nombre');
  }

  get apellidoCtrol() {
    return this.registerForm.get('apellido');
  }

  get cedulaCtrol() {
    return this.registerForm.get('cedula');
  }

  get emailCtrol() {
    return this.registerForm.get('email');
  }

  get comentarioCtrol() {
    return this.registerForm.get('comentario');
  }

  get residenciaCtrol() {
    return this.registerForm.get('residencia');
  }
}
