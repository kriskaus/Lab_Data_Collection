import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatButtonModule} from "@angular/material/button";
import { MatInputModule} from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar'
import { MatIcon, MatIconModule } from '@angular/material/icon'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { UploadService } from './services/upload.service';
import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';
import { RegisterComponent } from './register/register.component';
import { FileTableComponent } from './file-table/file-table.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { DetailsPageComponent } from './details-page/details-page.component';
import { AddUserDialogComponent } from './dialogs/add-user-dialog/add-user-dialog.component';
import { DiaolgService } from './services/diaolg.service';
import { DeleteUserDialogComponent } from './dialogs/delete-user-dialog/delete-user-dialog.component';
import { UpdateUserDialogComponent } from './dialogs/update-user-dialog/update-user-dialog.component';
import { FindUserDialogComponent } from './dialogs/find-user-dialog/find-user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DialogModule } from 'primeng/dialog';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    FileTableComponent,
    AdminDashboardComponent,
    DetailsPageComponent,
    AddUserDialogComponent,
    DeleteUserDialogComponent,
    UpdateUserDialogComponent,
    FindUserDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBar,
    MatIcon,
    MatSnackBarModule,
    BrowserAnimationsModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    TableModule,
    CardModule,
    FileUploadModule,
    MatDialogModule,
    MatSlideToggleModule,
    DialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    UploadService,
    UserService,
    provideHttpClient(withFetch()),
    MessageService,
    AdminService,
    provideAnimations(),
    DiaolgService,
    provideAnimationsAsync(),
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
