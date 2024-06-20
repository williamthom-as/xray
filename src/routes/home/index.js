import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';

import {AddDashboardDialog} from "../../dialog/add_dashboard_dialog";
import {KeyboardShortcutsDialog} from '../../dialog/keyboard_shortcuts_dialog';
import {CreateDashboardDialog} from '../../dialog/create_dashboard_dialog';

@inject(Router, DialogService, 'AjaxService', 'LocalStorageService', )
export class Index {

  modalOpen = false;
  showHome = false;

  constructor(router, dialogService, ajax, storageService) {
    this.router = router;
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

  keyboardShortcuts() {
    this.dialogService.open({
      viewModel: KeyboardShortcutsDialog,
      model: {},
    }).then(
      (_resp) => {},
      () => {}
    ).finally(
      () => {}
    )
  }

  create() {
    this.dialogService.open({
      viewModel: CreateDashboardDialog,
      model: {
        title: "",
        description: "",
        author: ""
      }
    }).then(
      (resp) => {
        this.router.navigateToRoute('dashboard-builder', { id: resp.id });
      },
      () => {}
    )
  }

}
