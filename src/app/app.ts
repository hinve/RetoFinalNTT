import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientesComponent } from './components/clientes-component/clientes-component';
import { LandingPage } from './landing-page/landing-page';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClientesComponent, LandingPage, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected title = 'RetoFinalNTT';
  
}
