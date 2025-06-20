import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { ClientesComponent } from './components/clientes-component/clientes-component';


export const routes: Routes = [
    { path: '', component: LandingPage }, // Ruta inicial (landing)
    { path: '/clientes' , component:ClientesComponent, pathMatch: 'full' },
 
];
