import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { UpdateUserDialogComponent } from '../dialogs/update-user-dialog/update-user-dialog.component';
import { DeleteUserDialogComponent } from '../dialogs/delete-user-dialog/delete-user-dialog.component';
import { FindUserDialogComponent } from '../dialogs/find-user-dialog/find-user-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DiaolgService {

  constructor(private dialog: MatDialog) { }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent);
    // this.dialog.open(AddUserDialogComponent);
  }

  openUpdateUserDialog() {
    this.dialog.open(UpdateUserDialogComponent)
  }
  openDeleteUserDialog() {
    this.dialog.open(DeleteUserDialogComponent)
  }

  openFindUserDialog() {
    this.dialog.open(FindUserDialogComponent)
  }
}
