/**
 * resize
 * 리사이즈
 * @param {*} target File or image Url
 * @param {*} size { width: 600, height: 600 }
 * @param {*} maximumSize 최대 maximumsize
 *
 * @returns {Files} 리사이징 파일 || 원본 파일 return
 */
export default class Resize {
  constructor(maximumSize) {
    // 계산 필요함. mb단위로.
    this.maximumSize = maximumSize;
  }

  resize(target, size) {
    return this.isFile(target) ? this.byPass(target, size) : this.parseUrl(target, size);
  }

  isFile(target) {
    return target instanceof File;
  }

  async byPass(target, size) {
    return await this.checkSize(target) ? target : this.convertFile(target, size);
  }

  checkSize(target) {
    return new Promise(resolve => {
      return resolve(this.maximumSize > target);
    });
  }

  fileToDataurl(target) {
    return new Promise(resolve => {
      const fr = new FileReader();

      fr.onload = e => {
        return resolve(e.target.result);
      };
      fr.readAsDataURL(target);
    });
  }

  async convertFile(target, size) {
    const dataUrl = await this.fileToDataurl(target);
    const convertUrl = await this.convertUrl(dataUrl, size, target.size);

    return this.urlToBlob(convertUrl, target.name);
  }

  async parseUrl(target, size) {
    const convertUrl = await this.convertUrl(target, size);
    return this.urlToBlob(convertUrl, "download.jpg");
  }

  convertUrl(parseUrl, size, originSize) {
    return new Promise(resolve => {
      let canvas = document.createElement("canvas");
      let img = new Image();

      img.src = parseUrl;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        canvas.width = size.width || 600;
        canvas.height = size.height || 600;

        canvas.getContext("2d").drawImage(img, 0, 0, size.width, size.height);

        // url 일 경우... 300 * 1024 고정이 맞는걸까 ?
        const origin = originSize
          ? Math.min(originSize, 300 * 1024)
          : 300 * 1024;
        let q = 0.5;
        let d = 0.5;
        let dataUrl = "";
        let encUrl = "";

        for (let i = 0; i < 7; i++) {
          dataUrl = canvas.toDataURL("image/jpeg", q);
          encUrl = atob(dataUrl.replace("data:image/jpeg;base64,", "")).length;

          if (encUrl > origin) {
            q -= d /= 2;
          } else {
            q += d /= 2;
          }
        }

        return resolve(dataUrl);
      };
    });
  }

  urlToBlob(result, fileName) {
    const bytes =
      result.split(",")[0].indexOf("base64") >= 0
        ? atob(result.split(",")[1])
        : encodeURI(result.split(",")[1]);
    const mime = result.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);

    for (let i = 0; i < max; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    return new File([new Blob([ia], { type: mime })], fileName, { type: mime });
  }
}
