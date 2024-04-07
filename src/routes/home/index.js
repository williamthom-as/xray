import {inject} from 'aurelia-framework';
import {combo} from 'aurelia-combo';
import {DialogService} from 'aurelia-dialog-lite';

import {AddDashboardDialog} from "../../dialog/add_dashboard_dialog";

@inject(DialogService, 'AjaxService', 'LocalStorageService')
export class Index {

  modalOpen = false;

  constructor(dialogService, ajax, storageService) {
    this.dialogService = dialogService;
    this.storageService = storageService;
    this.ajax = ajax;
  }

  bind() {}

  add() {
    if (this.modalOpen === false) {
      this.modalOpen = true
      this.dialogService.open({
        viewModel: AddDashboardDialog,
        model: {},
      }).then(
        (_resp) => {},
        () => {}
      ).finally(
        () => {
          this.modalOpen = false;
        }
      )
    }
  }

  reload() {
    this.getDashboards()
  }

}
