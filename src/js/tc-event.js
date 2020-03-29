import Resize from './resize-image';

const resize = new Resize(1000000);
const size = { width: 600, height: 600 };

document.getElementById('resize').addEventListener('change', (e) => {
  const file = e.target.files[0];
  resize.start(file, { width: 600, height: 600 }).then(resp => console.log(resp));
});

document.getElementById('urlTest').addEventListener('click', (e) => {
  const targetUrl = 'https://apis.iparking.co.kr/iparking-incoming-images/garage/apply/hyundai/2020-02-20/1582187877141_20200125_200239.jpg';
  resize.start(targetUrl, size).then(resp => console.log('Url result : ', resp));
});

document.getElementById('generator').addEventListener('click', e => {
  const files = document.getElementsByName('uplaodfile');
  files.forEach(v => resize.start(v.files[0], { width: 600, height: 600 }).then(resp => console.log(resp)));
});
