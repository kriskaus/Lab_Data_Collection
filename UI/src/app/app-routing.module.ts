import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guard/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { roleGuard } from './guard/role.guard';
import { DetailsPageComponent } from './details-page/details-page.component';
import { AppComponent } from './app.component';

const routes: Routes = [
 {path:'', component: AppComponent,
    children: [
                // { path: '', component: RegisterComponent },
                { path: 'register', component: RegisterComponent },
                { path: 'login', component: LoginComponent },
                { path: 'home', component: HomeComponent,canActivate: [authGuard, roleGuard] },
                { path: 'admin', component: AdminDashboardComponent,canActivate: [authGuard, roleGuard] },
                { path: 'logout', component: LoginComponent }, // Add this line to define the logout route
                { path: 'details', component: DetailsPageComponent}
    ]
 }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule ]
})
export class AppRoutingModule { }

