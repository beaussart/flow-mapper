import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { Observable } from 'rxjs';
import { App } from '../../../types/app';
import { MatDialog } from '@angular/material';
import { DeleteDialogComponent } from '../../../dialogs/delete-dialog/delete-dialog.component';
import { CreateAppRequest, DeleteAppRequest } from '../../../state/app.actions';
import { CreateAppDialogComponent } from '../../../dialogs/create-app-dialog/create-app-dialog.component';

@Component({
  selector: 'fl-apps-list-tab',
  templateUrl: './apps-list-tab.component.html',
  styleUrls: ['./apps-list-tab.component.scss'],
})
export class AppsListTabComponent implements OnInit {
  @Select(AppState.apps)
  apps$: Observable<App[]>;

  displayedColumns: string[] = ['name', 'description', 'actions'];
  constructor(public dialog: MatDialog, public store: Store) {}

  ngOnInit() {}

  openDialog(app: App): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {
        id: app.id,
        name: app.name,
        type: 'app',
        deleteFunction: this.deleteApp.bind(this),
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateAppDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      const { name, description, appTechnos } = result;
      this.store.dispatch(new CreateAppRequest(name, description, appTechnos));
    });
  }

  deleteApp(id: number) {
    this.store.dispatch(new DeleteAppRequest(id));
  }
}
