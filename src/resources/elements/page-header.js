import {inject, bindable} from 'aurelia-framework';
import {combo} from 'aurelia-combo';
import {DialogService} from 'aurelia-dialog-lite';
import {QuickMenuDialog} from "../../dialog/quick_menu_dialog";
import {QuickLoadRemoteDialog} from "../../dialog/quick_load_remote_dialog";
import {keyboardShortcutsDialog} from '../../dialog/keyboard_shortcuts_dialog';

@inject(DialogService)
export class PageHeader {
  @bindable title = null;
  @bindable description = null;
  @bindable showHome = true;

  quickMenuModalOpen = false;
  quickRemoteModalOpen = false;

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  @combo('ctrl+j', 'command+j')
  quickMenu() {
    if (this.quickMenuModalOpen === false) {
      this.quickMenuModalOpen = true
      this.dialogService.open({
        viewModel: QuickMenuDialog,
        model: {},
      }).then(
        (_resp) => {},
        () => {}
      ).finally(
        () => {
          this.quickMenuModalOpen = false;
        }
      )
    }
  }

  @combo('ctrl+d', 'command+d')
  quickRemote() {
    if (this.quickRemoteModalOpen === false) {
      this.quickRemoteModalOpen = true
      this.dialogService.open({
        viewModel: QuickLoadRemoteDialog,
        model: {
          type: 'gist'
        },
      }).then(
        (_resp) => {},
        () => {}
      ).finally(
        () => {
          this.quickRemoteModalOpen = false;
        }
      )
    }
  }

  keyboardShortcuts() {
    this.dialogService.open({
      viewModel: keyboardShortcutsDialog,
      model: {},
    }).then(
      (_resp) => {},
      () => {}
    ).finally(
      () => {}
    )
  }
}