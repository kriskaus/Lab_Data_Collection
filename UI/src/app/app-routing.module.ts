import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
 { path: '', component: RegisterComponent },
 { path: 'register', component: RegisterComponent },
 { path: 'login', component: LoginComponent },
 { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
 { path: 'logout', component: LoginComponent }, // Add this line to define the logout route
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }

