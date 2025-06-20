import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes-component/clientes-component';
import { LandingPage } from './landing-page/landing-page';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'clientes', component: ClientesComponent }
];
