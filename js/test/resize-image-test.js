document.getElementById('resize').addEventListener('change', function (e) {
  var args = e.target.files[0];

  window.imageResize(args, { width: 600, height: 600 })
    .then(resp => {
      console.log(resp)
      // document.getElementById('r').setAttribute('src', resp)
    });
});
// resize('', { width: 600, height600 });