# resize-image

리사이징 모듈 입니다. <br />
JPEG 기반으로 Q 펙터를 조절하여 이미지에 맞는 해상도를 찾아서 리사이징을 진행 합니다.

### npm script

`npm run start` resize 모듈을 테스트 할 수 있는 명령어 입니다.

### example

아래는 간단한 예제 입니다.
내부적으로 generator와 promise 기반의 로직으로 구성되어 있어 순서보장도 같이 진행하고 있습니다.

```javascript
const origin = !!event.dataTransfer.items
  ? [...event.dataTransfer.items]
  : [...event.dataTransfer.files];
const resizeFiles = [];

origin.forEach(async file => {
  this.resizeFiles.push({
    origin: file.getAsFile(),
    resize: await resize.do(file.getAsFile()),
  });
});
```
