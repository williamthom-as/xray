import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {AddDashboardDialog} from "../../dialog/add_dashboard_dialog";

@inject(DialogService, 'LocalStorageService')
export class Index {

  modalOpen = false;
  viewed = null;

  constructor(dialogService, storageService) {
    this.dialogService = dialogService;
    this.storageService = storageService;
  }

  bind() {
    this.getRecentlyViewed();
  }

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
  
  getRecentlyViewed() {
    this.storageService.getRecentlyViewed()
      .then(viewed => {
        this.viewed = viewed.reverse();
      })
      .catch(error => {
        console.error(error);
      });
  }
}
