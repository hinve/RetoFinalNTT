import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientesComponent } from './components/clientes-component/clientes-component';
import { Header } from "./header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClientesComponent, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected title = 'RetoFinalNTT';
  
}
