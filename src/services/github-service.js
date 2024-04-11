export class GithubService {

  getGist(gistId) {
    return new Promise((resolve, reject) => {
      let gistUrl = `https://api.github.com/gists/${gistId}`;

      fetch(gistUrl)
        .then(response => {
          if (!response.ok) {
            console.log(response);
            throw new Error(`Code: [${response.status}]`);
          }

          return response.json();
        }).then(gist => {
          if (gist && gist.files) {
            for (let filename in gist.files) {
              if (gist.files[filename].language === 'JSON') {
                resolve(gist);
              }
            }
          }

          reject(new Error('No JSON file found in the gist'));
        })
        .catch(error => reject(error));
    });
  }
}