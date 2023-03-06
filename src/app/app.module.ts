import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';


import { ROUTING } from './app.routing';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TemplateComponent } from './template/template.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { ComprobanteComponent } from './comprobante/comprobante.component';
import { TransaccionesComponent } from './transacciones/transacciones.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from './services/firebase.service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TemplateComponent,
    FooterComponent,
    LandingComponent,
    ComprobanteComponent,
    TransaccionesComponent,
    ConfirmacionComponent,
    ShoppingCartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ROUTING,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
