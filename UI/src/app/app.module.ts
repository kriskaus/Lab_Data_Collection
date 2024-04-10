import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatButtonModule} from "@angular/material/button";
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatProgressBar} from '@angular/material/progress-bar'
import { MatIcon } from '@angular/material/icon'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { UploadService } from './services/upload.service';
import { UserService } from './services/user.service';
import { RegisterComponent } from './register/register.component';
import { FileTableComponent } from './file-table/file-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    FileTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatFormField,
    MatLabel,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBar,
    MatIcon
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    UploadService,
    UserService,
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBar,
    MatIcon


]
})
export class AppModule { }
