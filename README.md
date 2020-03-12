# resize-image

- 이미지 리사이징 모듈
- **webpack**기반으로 되어 있기 때문에 `npm script`에 있는 명령어들만 잘 사용하면 됨.

- ## build
  - prod : entry => resize-image.js
  - dev : entry => tc-event.js

- ## npm script
  - prod-build : prod 버전 build
  - dev-server : webpack-dev-server 기동

- ## use
  ```javascript
  document.getElementById('resize').addEventListener('change', (e) => {
    const resize = new Resize(1000000);
    const file = e.target.files[0];
    const size = { width: 600, height: 600 };

    console.log(`File start : ${file}`);

    resize.resize(file, size)
      .then(resp => console.log('File result : ', resp));
  });

  document.getElementById('urlTest').addEventListener('click', (e) => {
    const resize = new Resize(1000000);
    const targetUrl = 'imgUrl';
    const size = { width: 600, height: 600 };

    console.log(`Url start : ${targetUrl}`);

    resize.resize(targetUrl, size)
      .then(resp => console.log('Url result : ', resp));
  });
  ```

## todo
  - `generator` 사용하여 순서 보장
  - `new Resize()`로 생성 시 `target size`에 대한 계산 구현 예정 
  - url 이미지를 canvas 에 그려서 해당 이미지를 `resize`시 해당 origine size에 대한 고민