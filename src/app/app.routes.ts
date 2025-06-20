import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes-component/clientes-component';

export const routes: Routes = [
    { path: '/clientes' , component:ClientesComponent, pathMatch: 'full' },
];
