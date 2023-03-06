import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  animales: any[] = [];
  
  ganado = [
    { nombre: 'Vaca', precio: 410, cantidad: 1 },
    { nombre: 'Toro', precio: 400, cantidad: 1 },
    { nombre: 'Caballo', precio: 350, cantidad: 1 },
    { nombre: 'Cerdo', precio: 100, cantidad: 1 },
    { nombre: 'Oveja', precio: 90, cantidad: 1 },
    { nombre: 'Cabra', precio: 160, cantidad: 1 },
    { nombre: 'Buey', precio: 500, cantidad: 1 },
    { nombre: 'Burro', precio: 300, cantidad: 1 },
    { nombre: 'Yegua', precio: 400, cantidad: 1 },
    { nombre: 'Mula', precio: 390, cantidad: 1 },
    { nombre: 'Llama', precio: 600, cantidad: 1 },
    { nombre: 'Chivo', precio: 260, cantidad: 1 },
  ];

  @Output() attributeChanged = new EventEmitter<number>();
  
  constructor() { 
  }

  total = 0;
  animalSeleccionado: any;
  animal = { nombre: '', precio: 0, cantidad: 1 };

  ngOnInit() {
    this.animalSeleccionado = -1;
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.animales.reduce((acc, animal) => acc + (animal.precio * animal.cantidad), 0);
    this.attributeChanged.emit(this.total);
  }

  addAnimal() {
    this.animales.push({ ...this.animalSeleccionado });
    this.calculateTotal();
  }

  addItem() {
    this.animales.push({ ...this.animal });
    this.animal = { nombre: '', precio: 0, cantidad: 1 };
    this.calculateTotal();
  }

  removeItem(item: { nombre: string; precio: number; cantidad: number; }) {
    this.animales = this.animales.filter(i => i !== item);
    this.calculateTotal();
  }
}