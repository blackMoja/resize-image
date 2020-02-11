# resize-image

- 이미지 리사이징 모듈
- **promise**기반으로 되어 있기 때문에 아래와 같은 polyfill import가 필요함.
  ```html
  <!-- Automatically provides/replaces `Promise` if missing or broken. -->
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>

  <!-- Minified version of `es6-promise-auto` below. -->
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
  ```
- 사용법
  ```javascript
  window.imageResize(args, { width: 600, height: 600 })
    .then(function (resp) { 
      // do something
    });
  ```
- etc
  - webpack + babel
  - 이슈가 발생하면 수정해주세요.
    ```
    ### 커밋명
    
    [이슈]
     - 이슈내용
    ```