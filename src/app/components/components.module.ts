import { RequestItemComponent } from "./request-item/requestItem.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ModalDialogComponent } from "./modal-dialog/modal-dialog";
import { ModalDialogController } from "./modal-dialog/modal-dialog.controller";
import { DidDocumentComponent } from "./did-document/diddocument.component";


@NgModule({
    declarations: [
      RequestItemComponent,
      ModalDialogComponent,
      DidDocumentComponent,
     ],
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
    ],
    exports: [
      RequestItemComponent,
      DidDocumentComponent,
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