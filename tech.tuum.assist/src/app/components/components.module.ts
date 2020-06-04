import { RequestItemComponent } from "./request-item/requestItem.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [RequestItemComponent ],
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
    ],
    exports: [RequestItemComponent],
    providers: [ ],
    entryComponents: [],
  })
  export class ComponentsModule { }