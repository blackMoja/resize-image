import Resize from './resize-image';

document.getElementById('resize').addEventListener('change', (e) => {
  const resize = new Resize(1000000);
  const file = e.target.files[0];
  const size = { width: 600, height: 600 };

  resize.resize(file, size)
    .then(resp => { console.log(resp); })
});

document.getElementById('urlTest').addEventListener('click', (e) => {
  const resize = new Resize(1000000);
  const targetUrl = 'https://apis.iparking.co.kr/iparking-incoming-images/garage/apply/hyundai/2020-02-20/1582187877141_20200125_200239.jpg';
  const size = { width: 600, height: 600 };

  console.log(`Url start : ${targetUrl}`);

  resize.resize(targetUrl, size)
    .then(resp => console.log('Url result : ', resp));
});
