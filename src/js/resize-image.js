/**
 * resize
 * 리사이즈
 * @param {*} t File or image Url
 * @param {*} s { width: 600, height: 600 }
 * @param {*} maxSize 최대 maximumsize
 *
 * @returns {Files} 리사이징 파일 || 원본 파일 return
 */
// 단일 파일은 옵션 , params 로 array를 받는 interface
// array like object 유사배열 도 정상적으로 동작 하게끔.

export default class Resize {
  constructor(maxSize) {
    this.maxSize = 1024 * 1024 * maxSize ? maxSize : 1;
  }

  do(t, s) {
    return this.r(t, s).next().value;
  }

  *r(t, s) {
    return yield this.isFile(t) ? this.gSingle(t, s) : this.gList(this.isDomCollection(t) ? this.pCollection([...t]) : t, s);
  }

  isFile(t) {
    return t instanceof File;
  }

  isDomCollection(t) {
    return t instanceof NodeList || t instanceof HTMLCollection;
  }

  pCollection(t) {
    return t.map(v => v.files[0]);
  }

  gList(t, s) {
    return this.pPromise(t.map(v => this.isFile(v) ? this.byPass(v, s) : this.parseUrl(v, s)));
  }

  gSingle(t, s) {
    return typeof t === 'string' ? this.pUrl(t, s) : this.byPass(t, s);
  }

  async pPromise(t) {
    return await Promise.all(t);
  }

  async byPass(t, s) {
    return await this.chkSize(t) ? t : this.convertFile(t, s);
  }

  chkSize(t) {
    return new Promise(resolve => resolve(this.maxSize > t.size));
  }

  f2u(t) {
    return new Promise(resolve => {
      const fr = new FileReader();

      fr.onload = e => resolve(e.target.result);
      fr.readAsDataURL(t);
    });
  }

  async convertFile(t, s) {
    const u = await this.f2u(t);
    const c = await this.convertUrl(u, s, t.size);

    return this.u2b(c, t.name);
  }

  async pUrl(t, s) {
    const c = await this.convertUrl(t, s);
    return this.u2b(c, 'download.jpg');
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

  u2b(result, fileName) {
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
