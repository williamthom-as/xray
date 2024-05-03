export class LocalStorageService {

  DASHBOARD_KEY = "dashboards";
  RECENTLY_VIEWED = "recently_viewed";

  getDashboards() {
    return new Promise((resolve, reject) => {
      try {
        let currentDashboards = JSON.parse(localStorage.getItem(this.DASHBOARD_KEY));

        if (!currentDashboards) {
          currentDashboards = [];
        }

        resolve(currentDashboards);
      } catch (error) {
        reject(error);
      }
    });
  }

  getDashboard(id) {
    return new Promise((resolve, reject) => {
      this.getDashboards()
        .then(dashboards => {
          const dashboard = dashboards.find(d => d.id === id);

          if (!dashboard) {
            reject(new Error(`No dashboard found with the id - '${id}'`));
          }

          resolve(dashboard);
        })
        .catch((error) => reject(error));
    });
  }

  setDashboard(model) {
    return new Promise((resolve, reject) => {
      this.getDashboards()
        .then(dashboards => {
          let existing = dashboards.find(d => d.id === model.id);
  
          if (!existing) {
            dashboards.push(model);

            localStorage.setItem(this.DASHBOARD_KEY, JSON.stringify(dashboards));

            resolve(model);
          } else {
            reject(new Error('Dashboard with the same name already exists!'));
          }
        })
        .catch(error => reject(error));
    });
  }

  updateDashboard(model) {
    return new Promise((resolve, reject) => {
      this.getDashboards()
        .then(dashboards => {
          let index = dashboards.findIndex(d => d.id === model.id);
  
          if (index !== -1) {
            dashboards[index] = model;
            localStorage.setItem(this.DASHBOARD_KEY, JSON.stringify(dashboards));

            resolve(model);
          } else {
            reject(new Error(`No dashboard found with the id - '${model.id}'`));
          }
        })
        .catch(error => reject(error));
    });
  }

  removeDashboard(id) {
    return new Promise((resolve, reject) => {
      this.getDashboards()
        .then(dashboards => {
          let index = dashboards.findIndex(d => d.id === id);
  
          if (index !== -1) {
            dashboards.splice(index, 1);
            localStorage.setItem(this.DASHBOARD_KEY, JSON.stringify(dashboards));

            resolve();
          } else {
            reject(new Error(`No dashboard found with the id - '${id}'`));
          }
        })
        .catch(error => reject(error));
    });
  }

  addRecentlyViewed(dashboard) {
    let recentlyViewed = JSON.parse(localStorage.getItem(this.RECENTLY_VIEWED));

    if (!recentlyViewed) {
      recentlyViewed = [];
    }

    const index = recentlyViewed.findIndex(d => d.gistId === dashboard.gistId);
    if (index !== -1) {
      recentlyViewed.splice(index, 1);
    } else if (recentlyViewed.length >= 10) {
      recentlyViewed.shift();
    }

    recentlyViewed.push(dashboard);

    localStorage.setItem(this.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
  }

  getRecentlyViewed() {
    return new Promise((resolve, reject) => {
      try {
        let recentlyViewed = JSON.parse(localStorage.getItem(this.RECENTLY_VIEWED));

        if (!recentlyViewed) {
          recentlyViewed = [];
        }

        resolve(recentlyViewed);
      } catch (error) {
        reject(error);
      }
    });
  }
}