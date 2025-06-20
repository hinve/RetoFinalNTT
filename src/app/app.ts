import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientesComponent } from './components/clientes-component/clientes-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClientesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'RetoFinalNTT';
  
}
