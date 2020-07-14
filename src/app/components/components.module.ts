import { RequestItemComponent } from "./request-item/requestItem.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ModalDialogComponent } from "./modal-dialog/modal-dialog";
import { ModalDialogController } from "./modal-dialog/modal-dialog.controller";


@NgModule({
    declarations: [
      RequestItemComponent,
      ModalDialogComponent
     ],
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
    ],
    exports: [
      RequestItemComponent,
      ModalDialogComponent
    ],
    providers: [
      ModalDialogController
     ],
    entryComponents: [
      ModalDialogComponent
    ],
  })
  export class ComponentsModule { }