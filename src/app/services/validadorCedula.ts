import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[cedulaValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CedulaValidatorDirective, multi: true }]
})
export class CedulaValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return cedulaValidatorFn(control);
  }
}

export function cedulaValidatorFn(control: AbstractControl): { [key: string]: any } | null {
  const cedula = control.value?.toString();
  let cedulaCorrecta = false;
  if (cedula && cedula.length == 10) {
    let tercerDigito = parseInt(cedula.substring(2, 3));
    if (tercerDigito < 6) {
      let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let verificador = parseInt(cedula.substring(9, 10));
      let suma: number = 0;
      let digito: number = 0;
      for (let i = 0; i < (cedula.length - 1); i++) {
        digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
        suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
      }
      suma = Math.round(suma);
      if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
        cedulaCorrecta = true;
      } else if ((10 - (Math.round(suma % 10))) == verificador) {
        cedulaCorrecta = true;
      } else {
        cedulaCorrecta = false;
      }
    }
  }
  return cedulaCorrecta ? null : { 'cedulaInvalida': true };
}