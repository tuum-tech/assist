import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalDialogComponent } from './modal-dialog';
import { IModalDialogConfig } from './modal-dialog.config';

class ModalDialog {
  constructor(
    public config: IModalDialogConfig,
    private modalCtrl: ModalController
  ) {}

  async show() {
    const modal = await this.modalCtrl.create({
      component: ModalDialogComponent,
      componentProps: {
        config: this.config,
      },
      animated: false,
      cssClass: 'no-background',
    });
    modal.present();
  }
}

@Injectable({
  providedIn: 'root',
})
export class ModalDialogController {
  constructor(public modalCtrl: ModalController) {}

  create(config: IModalDialogConfig): ModalDialog {
    return new ModalDialog(config, this.modalCtrl);
  }
}
