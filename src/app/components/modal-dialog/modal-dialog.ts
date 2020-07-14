import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IModalDialogConfig, ModalDialogEnum, ModalDialogButtonEnum } from './modal-dialog.config';

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.html',
  styleUrls: ['./modal-dialog.scss'],
})
export class ModalDialogComponent implements OnInit {
  public config: IModalDialogConfig;
  public readyToDisplay = false;
  public inputValue = '';

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.config = this.navParams.get('config');
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.readyToDisplay = false;
  }

  ionViewDidEnter() {
    // Animate boxes appearance with a fade in.
    setTimeout(() => {
      this.readyToDisplay = true;
    }, 100);
  }

  get dialogImage() {
    if (this.config.dialogType === ModalDialogEnum.Alert) {
      return '../../../assets/images/Icon-ios-close-circle-outline.svg';
    }
    if (this.config.dialogType === ModalDialogEnum.Info) {
      return '../../../assets/images/Icon feather-info.svg';
    }
    if (this.config.dialogType === ModalDialogEnum.Success) {
      return '../../../assets/images/Icon-ios-checkmark-circle-outline.svg';
    }

    return '';
  }

  buttonClass(id) {
    if (!this.config.buttons[id].buttonType ||
         this.config.buttons[id].buttonType == ModalDialogButtonEnum.Primary) return "button-primary";
    
    return "button-secondary"
  }

  get titleClass() {
    if (this.config.dialogType === ModalDialogEnum.Alert) {
      return 'title-alert';
    }
    if (this.config.dialogType === ModalDialogEnum.Info) {
      return 'title-points';
    }
    if (this.config.dialogType === ModalDialogEnum.Success) {
      return 'title-success';
    }
    return 'title-default';
  }

  backgroundClicked(dismissIfId: string, event: MouseEvent) {
    const target: any = event.target;
    if (target.id === dismissIfId) {
      this.cancel();
    }
  }

  buttonClick(id) {
    if (this.config.buttons[id].callback) {
      this.config.buttons[id].callback(this.inputValue);
    }
    this.modalCtrl.dismiss(null);
  }

  cancel() {
    if (this.config.cancelCallback) {
      this.config.cancelCallback();
    }

    this.modalCtrl.dismiss(null);
  }
}
