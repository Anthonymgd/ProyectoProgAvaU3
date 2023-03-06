import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Persona } from '../../environments/persona';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  headers_object = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  httpOptions = {headers: this.headers_object};

  constructor(private http: HttpClient) {}

  registrarPersona(persona: Persona) {
    return this.http.post('http://100.25.196.54:8080/persona', persona ,this.httpOptions);
  }

  verTodo() {
    return this.http.get<[any]>('http://100.25.196.54:8080/persona', this.httpOptions);
  }

  confirmacionPedido(id: number, estado1: String, track: String){
    return this.http.put<Persona>(`http://100.25.196.54:8080/estado1/${id}`, { estado1, track } , this.httpOptions);
  }

  confirmacionComprobante(id: number, estado2: String){
    return this.http.put<Persona>(`http://100.25.196.54:8080/estado2/${id}`, { estado2 } , this.httpOptions);
  }

  enviarComprobante(id: number, imagen: String){
    return this.http.put<Persona>(`http://100.25.196.54:8080/enviarComprobante/${id}`, {imagen}, this.httpOptions);
  }
}
