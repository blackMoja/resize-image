/** 
 * resize 
 * 리사이즈 
 * @param {*} target 
 * @param {*} size 
 */
var isDebug = location.href.indexOf('localhost') >= 0;

(function (ns) {

  var resize = function (target, size) {
    return isFile(target) ? convertFile(target, size) : convertUrl(target, size);
  };

  var isFile = function (target) {
    return target instanceof File;
  };

  var convertFile = function (target, size) {
    console.log('convertFile : ', target);
    return fileToDataurl(target, size)
      .then(function (dataUrl) {
        return convertUrl(dataUrl, size, target);
      })
      .then(function (result) {
        return urlToBlob(result);
      })
  }

  var fileToDataurl = function (target) {
    return new Promise(function (resolve) {
      var fr = new FileReader();

      fr.onload = function (e) {
        return resolve(e.target.result);
      }
      fr.readAsDataURL(target);
    });
  };

  var convertUrl = function (target, size, file) {
    return new Promise(function (resolve) {
      var canvas = document.createElement('canvas');
      var img = new Image();

      img.src = target;
      img.crossOrigin = 'anonymous';

      img.onload = function () {

        canvas.width = size.width || 600;
        canvas.height = size.height || 600;

        canvas.getContext('2d').drawImage(img, 0, 0, size.width, size.height);

        var q = 0.5;
        var d = 0.5;
        var origin = Math.min(file.size, 300 * 1024);
        var dataUrl = '';
        var encUrl = '';

        for (var i = 0; i < 7; i++) {
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
  };

  var urlToBlob = function (target) {
    var bytes = target.split(',')[0].indexOf('base64') >= 0 ? atob(target.split(',')[1]) : encodeURI(target.split(',')[1]);
    var mime = target.split(',')[0].split(':')[1].split(';')[0];
    var max = bytes.length;
    var ia = new Uint8Array(max);

    for (var i = 0; i < max; i++) {
      ia[i] = bytes.charCodeAt(i);
    }

    console.log('result : ', new Blob([ia], { type: mime }));

    return new Blob([ia], { type: mime });
  }

  ns.imageResize = resize;

  if (isDebug) {
    ns.isFile = isFile;
    ns.convertFile = convertFile
    ns.fileToUrl = fileToDataurl
    ns.urlToImage = convertUrl
    ns.urlTOBlob = urlToBlob
  }
})(window);
