export class FileToTextValueConverter {

  toView(file) {
    let dataURL = readFileAsDataURL(file)
    
    return dataURL.then(dataURL => {
      return dataURL;
    })
  }
}

async function readFileAsDataURL(file) {
  let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsText(file);
  });

  console.log(result_base64, 'inside'); // aGV5IHRoZXJl...

  return result_base64;
}