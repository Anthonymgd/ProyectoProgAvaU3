import { Component, OnInit, SimpleChanges } from '@angular/core';

import { FirebaseService } from '../services/firebase.service';
import { Persona } from '../../environments/persona';
import { Router } from '@angular/router';
import { MailerService } from '../services/mailer.service';

import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss'],
})
export class TransaccionesComponent implements OnInit {
  pendiente!: Boolean;
  completado!: Boolean;
  rechazado!: Boolean;

  listaPersona!: [Persona];
  estado: String = 'pendiente';

  constructor(
    private servicio: FirebaseService,
    private router: Router,
    private emailService: MailerService
  ) {}

  ngOnInit(): void {
    this.consultar();
  }

  sendMail(email: String, html: String, subject: String) {
    let reqObj = {
      email: email,
      subject: subject,
      html: html,
    };
    this.emailService.sendMessage(reqObj).subscribe((data) => {
      console.log(data);
    });
  }

  cambiarEstado(estado: String) {
    this.estado = estado;
    console.log(estado);
    this.consultar();
  }

  consultar() {
    this.servicio.verTodo().subscribe(
      (res) => {
        console.log('Correcto');
        console.log(res);
        this.listaPersona = res;
        this.pendiente = this.listaPersona.every(
          (persona) => persona.estado2 == 'pendiente'
        );
        this.completado = this.listaPersona.every(
          (persona) => persona.estado2 == 'completado'
        );
        this.rechazado = this.listaPersona.every(
          (persona) => persona.estado2 == 'rechazado'
        );
      },
      (err) => console.log(err)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    // actualizar propiedades y/o llamar a metodo para refrescar
    this.consultar();
  }

  aceptar(id: number, email: String) {
    Swal.fire({
      title: '¿Los datos del comprobante son correctos?',
      text: 'Este mensaje es una confirmación, no se podrá modificar más adelante.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, completar pedido',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.confirmacionComprobante(id, 'completado').subscribe(
          (res) => {
            this.consultar();
            const mensaje = `
  <div style="text-align: center; color: rgb(34, 34, 34);">
    <div style="font-family: sans-serif; font-size: 16px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://i.ibb.co/G2FgjXc/logo-w.png" width="200" height="75" alt="Logo">
        <br>
        <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4zGUSqYAOFVzdDXlb-le_yafuMhwy6TIIL94Za-7CHjgq7atTLG3DAYacBUW_u0S60H1oZlE2A" width="200" height="50" alt="Logo">
      </div>
      <div style="font-weight: bold; margin-bottom: 10px;">
      <p>Muchas gracias por interesarse en nuestra empresa.</p>
      <p style="font-weight: normal;">Su pedido fue completado con éxito.</p>
      <p style="margin-bottom: 10px;">Si quiere realizar otra compra puede ingresar al siguiente enlace:</p>
      </div>
        <button style="background: white; border: none; color: white; padding: 15px 40px; text-align: center; display: inline-block; font-family: Nunito, sans-serif; font-size: 18px; font-weight: bold; cursor: pointer;">
        <a style="display: inline-block; font-weight: bold; color: #0d6efd; text-decoration: none; border: 2px solid #0d6efd; border-radius: 4px; padding: 10px 20px; margin-bottom: 20px;" href="http://localhost:4200">Generar Nueva Compra</a>
        </button>
      <p style="margin-top: 40px; font-weight: bold; margin-bottom: 10px;">Att: LiveStock</p>
    </div>
  </div>
`;
            this.sendMail(email, mensaje, 'Pedido completado');
          },
          (err) => console.log(err)
        );
        swalWithBootstrapButtons.fire(
          '¡El pedido fue completado!',
          'El proceso de compra ha sido realizado con éxito.',
          'success'
        );
      } else
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel;
    });
  }

  cancelar(id: number) {
    Swal.fire({
      title: '¿Seguro que quiere rechazar el comprobante?',
      text: 'Este mensaje es una confirmación, no se podrá modificar más adelante.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar pedido',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.confirmacionComprobante(id, 'rechazado').subscribe(
          (res) => {
            this.consultar();
          },
          (err) => console.log(err)
        );
        swalWithBootstrapButtons.fire(
          '¡El comprobante fue rechazado!',
          'Se ha rechazado la compra correctamente. El proceso se canceló.',
          'success'
        );
      } else
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel;
    });
  }
}
