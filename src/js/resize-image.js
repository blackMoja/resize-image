/**  
 * resize  
 * 리사이즈  
 * @param {*} target File or image Url  
 * @param {*} size { width: 600, height: 600 } 
 * @param {*} maximumSize 최대 maximumsize 
 *  
 * @returns {Files} 리사이징 파일 || 원본 파일 return 
 */

// class 구조로 변경 
// async awit 
export default class Resize {
  constructor(target, size, maximumSize) {
    this.target = target;
    this.size = size;
    this.maximumSize = maximumSize;
  }

  resize() {
    return isFile() ? byPass() : convertUrl();
  }

  isFile() {
    return this.target instanceof File;
  }

  async byPass() {
    return await byPass() ? this.target : this.convertFile();
  }

  checkSize() {
    return new Promise(resolve => {
      return resolve(this.maximumSize > this.target.size);
    });
  }

  async convertFile() {
    const dataUrl = await this.fileToDataurl();
    await this.convertUrl(dataUrl);
  }

  fileToDataurl() {
    return new Promise(resolve => {
      const fr = new FileReader();

      fr.onload = e => {
        return resolve(e.target.result);
      }
      fr.readAsDataURL(target);
    });
  }

  convertUrl(parseUrl) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      let img = new Image();

      img.src = parseUrl;
      img.crossOrigin = 'anonymous';

      img.onload = () => {

        canvas.width = this.size.width || 600;
        canvas.height = this.size.height || 600;

        canvas.getContext('2d').drawImage(img, 0, 0, this.size.width, this.size.height);

        const origin = Math.min(this.target.size, 300 * 1024);
        let q = 0.5;
        let d = 0.5;
        let dataUrl = '';
        let encUrl = '';

        for (let i = 0; i < 7; i++) {
          dataUrl = canvas.toDataURL('image/jpeg', q);
          encUrl = atob(dataUrl.replace('data:image/jpeg;base64,', '')).length;

          if (encUrl > origin) {
            q -= d /= 2;
          } else {
            q += d /= 2;
          }
        }

        return resolve(dataUrl);
      }
    });
  }

  urlToBlob() {
    const bytes = this.target.split(',')[0].indexOf('base64') >= 0 ? atob(this.target.split(',')[1]) : encodeURI(this.target.split(',')[1]);
    const mime = this.target.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);

    for (let i = 0; i < max; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    return new File([new Blob([ia], { type: mime })], this.target.name);
  }
};