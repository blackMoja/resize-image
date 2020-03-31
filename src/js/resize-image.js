/**
 * resize
 * 리사이즈
 * @param {*} target File or image Url
 * @param {*} size { width: 600, height: 600 }
 * @param {*} maximumSize 최대 maximumsize
 *
 * @returns {Files} 리사이징 파일 || 원본 파일 return
 */
// 단일 파일은 옵션 , params 로 array를 받는 interface
// array like object도 정상적으로 동작 하게끔.

export default class Resize {
  constructor(maximumSize) {
    // 계산식 추가 필요함
    this.maximumSize = maximumSize;
  }

  do(t, s) {
    return this.r(t, s).next().value;
  }

  *r(t, s) {
    const pA = this.pA(t);
    return yield this.isArray(pA) ? this.gList(pA, s) : this.gOne(pA, s);
  }

  pA(t) {
    return [...t];
  }

  isFile(t) {
    return t instanceof File;
  }

  isArray(t) {
    return t instanceof Array;
  }

  gList(t, s) {
    return [] = t.map(v => {
      return this.isFile(v.files[0]) ? this.byPass(v.files[0], s) : this.parseUrl(v, s)
    });
  }

  gOne(t, s) {
    return this.isFile(t) ? this.byPass(t, s) : this.parseUrl(t, s);
  }

  async byPass(t, s) {
    return await this.checkSize(t) ? t : this.convertFile(t, s);
  }

  checkSize(t) {
    return new Promise(resolve => resolve(this.maximumSize > t.size));
  }

  fileToDataurl(t) {
    return new Promise(resolve => {
      const fr = new FileReader();

      fr.onload = e => resolve(e.target.result);
      fr.readAsDataURL(t);
    });
  }

  async convertFile(t, s) {
    const u = await this.fileToDataurl(t);
    const c = await this.convertUrl(u, s, t.size);

    return this.urlToBlob(c, t.name);
  }

  async parseUrl(t, s) {
    const c = await this.convertUrl(t, s);
    return this.urlToBlob(c, 'download.jpg');
  }

  convertUrl(parseUrl, size, originSize) {
    return new Promise(resolve => {
      let canvas = document.createElement('canvas');
      let img = new Image();

      img.src = parseUrl;
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        canvas.width = size.width || 600;
        canvas.height = size.height || 600;

        canvas.getContext('2d').drawImage(img, 0, 0, size.width, size.height);

        // url 일 경우... 300 * 1024 고정이 맞는걸까 ?
        const origin = originSize ? Math.min(originSize, 300 * 1024) : 300 * 1024;
        let q = 0.5;
        let d = 0.5;
        let dataUrl = '';
        let encUrl = '';

        for (let i = 0; i < 7; i++) {
          dataUrl = canvas.toDataURL('image/jpeg', q);
          encUrl = atob(dataUrl.replace('data:image/jpeg;base64,', "")).length;

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
      result.split(',')[0].indexOf('base64') >= 0 ? atob(result.split(',')[1]) : encodeURI(result.split(',')[1]);
    const mime = result
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);

    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);

    return new File([new Blob([ia], { type: mime })], fileName, { type: mime });
  }
}
