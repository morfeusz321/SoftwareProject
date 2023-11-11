import { ArgFormComponent } from '@app/dashboard/node-editor/components/arg-form/arg-form.component';
import { UrlFormComponent } from '@app/dashboard/node-editor/components/url-form/url-form.component';
import { NodeEditMenuComponent } from '@app/dashboard/node-editor/components/node-edit-menu/node-edit-menu.component';
import { NgModule } from '@angular/core';
import { AuthFormComponent } from '@app/dashboard/node-editor/components/auth-form/auth-form.component';
import { FormDropListComponent } from '@app/dashboard/node-editor/components/form-drop-list/form-drop-list.component';
import { ConditionalFormComponent } from '@app/dashboard/node-editor/components/conditional-form/conditional-form.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import {BodyFormComponent} from "@app/dashboard/node-editor/components/body-form/body-form.component";
import { TriggerFormComponent } from './components/trigger-form/trigger-form.component';
import { InviteFormComponent } from './components/invite-form/invite-form.component';
import { MapFormComponent } from '@app/dashboard/node-editor/components/map-form/map-form.component';

import {GraphEditorModule} from "@app/dashboard/graph-editor/graph-editor.module";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatListModule} from "@angular/material/list";
import {TranslocoModule} from "@ngneat/transloco";
import {MatTooltipModule} from "@angular/material/tooltip";
import {EmailFormComponent} from "@app/dashboard/node-editor/components/email-form/email-form.component";
import { SharedModule } from '@app/shared/shared.module';
import {
  CreateNewCustomNodeDialogComponent
} from '@app/dashboard/node-editor/components/new-node-dialog/create-new-custom-node-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {
  ImageDisplayComponent
} from "@app/dashboard/node-editor/components/image-display/image-display.component";
@NgModule({
  declarations: [
    UrlFormComponent,
    AuthFormComponent,
    ArgFormComponent,
    ConditionalFormComponent,
    FormDropListComponent,
    NodeEditMenuComponent,
    TriggerFormComponent,
    BodyFormComponent,
    InviteFormComponent,
    MapFormComponent,
    EmailFormComponent,
    InviteFormComponent,
    CreateNewCustomNodeDialogComponent,
    ImageDisplayComponent
  ],
  imports: [
    MatSidenavModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgForOf,
    MatButtonModule,
    NgIf,
    GraphEditorModule,
    MatTabsModule,
    MatListModule,
    TranslocoModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    SharedModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
  ],
  providers: [],
  exports: [
    BodyFormComponent,
    UrlFormComponent,
    AuthFormComponent
  ],
  bootstrap: [],
})
export class NodeEditorModule {}
