import { Component, OnInit, SimpleChanges } from '@angular/core';

import { FirebaseService } from '../services/firebase.service';
import { Persona } from '../../environments/persona';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { MailerService } from '../services/mailer.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss'],
})
export class ConfirmacionComponent implements OnInit {
  listaPersona!: [Persona];
  listaAceptados!: [Persona];
  listaRechazados!: [Persona];

  estado: String = '';
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
      },
      (err) => console.log(err)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    // actualizar propiedades y/o llamar a metodo para refrescar
    this.consultar();
  }

  aceptar(id: number, track: String, email: String) {
    Swal.fire({
      title: '¿Seguro que quiere aceptar el pedido?',
      text: 'Este mensaje es una confirmación, no se podrá modificar más adelante.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, aceptar pedido',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.confirmacionPedido(id, 'aceptado', track).subscribe(
          (res) => {
            console.log(res.track);
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
      <p style="font-weight: normal;">Su pedido ha sido aceptado. Para continuar con el proceso de compra debe ingresar siguiente enlace</p>
      <p style="margin-bottom: 10px;">Continuar proceso:</p>
      </div>
        <button style="background: white; border: none; color: white; padding: 15px 40px; text-align: center; display: inline-block; font-family: Nunito, sans-serif; font-size: 18px; font-weight: bold; cursor: pointer;">
        <a style="display: inline-block; font-weight: bold; color: #0d6efd; text-decoration: none; border: 2px solid #0d6efd; border-radius: 4px; padding: 10px 20px; margin-bottom: 20px;" href="http://localhost:4200/comprobante/${track}">Continuar</a>
        </button>
      <p style="margin-top: 40px; font-weight: bold; margin-bottom: 10px;">Att: LiveStock</p>
    </div>
  </div>
`;
            this.sendMail(email, mensaje, "Pedido aceptado");
          },
          (err) => console.log(err)
        );
        swalWithBootstrapButtons.fire(
          '¡El pedido fue aceptado!',
          'Usted ha aceptado el pedido correctamente, el cliente será notificado y deberá subir el comprobante de pago.',
          'success'
        );
      } else result.dismiss === Swal.DismissReason.cancel;
      /* Read more about handling dismissals below */
    });
  }

  cancelar(id: number, track: String) {
    Swal.fire({
      title: '¿Seguro que quiere cancelar el pedido?',
      text: 'Este mensaje es una confirmación, no se podrá modificar más adelante.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, cancelar pedido',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.confirmacionPedido(id, 'cancelado', track).subscribe(
          (res) => {
            console.log(res.track);
            this.consultar();
          },
          (err) => console.log(err)
        );
        swalWithBootstrapButtons.fire(
          '¡El pedido fue cancelado!',
          'Usted ha cancelado el pedido correctamente, el proceso se canceló.',
          'success'
        );
      } else result.dismiss === Swal.DismissReason.cancel;
      /* Read more about handling dismissals below */
    });
  }
}
