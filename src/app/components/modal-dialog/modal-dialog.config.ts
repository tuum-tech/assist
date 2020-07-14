type ModalDialogCallback = (data?: any) => void;

export enum ModalDialogEnum {
  NoIcon = 1,
  Success = 2,
  Alert = 3,
  Info = 4,
}

export enum ModalDialogButtonEnum {
  Primary = 1,
  Secondary = 2
}

export interface IModalDialogConfig {
  title: string;
  description: string;
  dialogType: ModalDialogEnum;
  buttons: IModalDialogAction[];
  input?: IModalDialogInput;
  cancelCallback: () => void;
}

export interface IModalDialogAction {
  title: string;
  callback: ModalDialogCallback;
  buttonType: ModalDialogButtonEnum;
}

export interface IModalDialogInput {
  placeholder: string;
}
