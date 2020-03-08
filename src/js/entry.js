import Resize from './resize-image';

document.getElementById('urlTest').addEventListener('click', (e) => {
  const resize = new Resize(1000000);
  const targetUrl = 'https://apis.iparking.co.kr/iparking-incoming-images/garage/apply/hyundai/2020-02-20/1582187877141_20200125_200239.jpg';
  const size = { width: 600, height: 600 };

  console.log('--init click--');
  console.log('resize :', resize);

  resize.resize(targetUrl, size)
    .then(resp => console.log(resp));
});
