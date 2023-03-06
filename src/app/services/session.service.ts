import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  // Guardar variable de sesión
  setSession(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSession(key: string) {
    let value = sessionStorage.getItem(key);
    if (value != null) {
      return JSON.parse(value);
    }
    return null;
  }

  // Eliminar variable de sesión
  removeSession(key: string): Boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
}
