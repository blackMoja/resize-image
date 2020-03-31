import Resize from './resize-image';

// tc case 도 정리하자.

const resize = new Resize();
const size = { width: 600, height: 600 };

document.getElementById('tc').addEventListener('click', e => {
  e.preventDefault();

  const files = document.getElementsByName('uploadfile');

  resize.do(files, size).then(resp => console.log(resp));
});

document.getElementById('change').addEventListener('change', e => {
  resize.do(e.target.files[0], size).then(resp => console.log(resp));
});

document.getElementById('formTc').addEventListener('click', e => {
  e.preventDefault();

  const tcForm = new FormData(document.getElementById('tcForm'));
  const uploadfile = tcForm.getAll('uploadfile_form');

  resize.do(uploadfile, size).then(resp => console.log(resp));
});