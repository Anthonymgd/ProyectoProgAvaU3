import { Component } from '@angular/core';

import { SessionService } from '../services/session.service';
import Swal from 'sweetalert2';


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
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  constructor(protected sesion: SessionService) { }

  cerrarSesion() {
    if ( this.sesion.removeSession("admin") )
    {
      Toast.fire({
        icon: 'success',
        title: 'Se ha cerrado sesión correctamente.'
      })
    }
  }

}
