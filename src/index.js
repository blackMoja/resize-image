import Resize from './js/resize';

const resize = new Resize();

class App {
  resizeFiles;

  constructor() {
    this.resizeFiles = [];
    this.setEvent();
  }

  renderTable() {
    const target = document.querySelector('tbody');
    let row = '';

    this.resizeFiles.forEach(({ origin, resize }, index) => {
      row += '<tr>';
      row += `<td><div class='row'><div>${origin.name}</div><div>${origin.size}</div></div></td>`;
      row += `<td><div class='row'><div>${resize.name}</div><div>${resize.size}</div></div></td>`;
      row += `<td><button type="button" data-index=${index} class="btn btn-success">다운로드</button></td>`;
      row += '</tr>';
    });

    target.innerHTML = row;
  }

  handleDrop = event => {
    event.preventDefault();
    const el = event.target.className;

    if (el !== 'panel-body') {
      return;
    }

    const files = !!event.dataTransfer.items
      ? [...event.dataTransfer.items]
      : [...event.dataTransfer.files];

    files.forEach(async file => {
      if (file.kind !== 'file') {
        return;
      }

      this.resizeFiles.push({
        origin: file.getAsFile(),
        resize: await resize.do(file.getAsFile()),
      });

      this.resizeFiles.length === files.length && this.renderTable();
    });
  };
  handleDragOver = event => {
    event.preventDefault();
  };
  handleClick = event => {
    const nodeName = event.target.nodeName;

    if (nodeName !== 'BUTTON') {
      return;
    }

    const index = event.target.dataset.index;
    const { resize } = this.resizeFiles[index];

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(resize);
    link.download = resize.name;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.parentNode.removeChild(link);
    }, 0);
  };

  setEvent() {
    window.addEventListener('drop', this.handleDrop);
    window.addEventListener('dragover', this.handleDragOver);
    window.addEventListener('click', this.handleClick);
  }
}

new App();
