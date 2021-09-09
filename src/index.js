import Resize from './js/resize';

const resize = new Resize();

class App {
  panelEl;
  tbodyEl;

  constructor() {
    this.panelEl = document.getElementById('panel');
    this.tbodyEl = document.querySelector('tbody');

    this.setEvent();
  }

  renderTable(files) {
    let row = '';

    files.forEach(({ origin, resize }) => {
      row += '<tr>'
      row += `<td><div class='row'><span>${origin.name}</span> | <span>${origin.size}</span></div></td>`;
      row += `<td><div class='row'><span>${resize.name}</span> | <span>${resize.size}</span></div></td>`;
      row += '</tr>'
    });

    this.tbodyEl.innerHTML = row;
  }

  handleDrop = event => {
    event.preventDefault();

    const files = !!event.dataTransfer.items
      ? [...event.dataTransfer.items]
      : [...event.dataTransfer.files];
    const resizeFiles = [];

    files.forEach(async file => {
      if (file.kind !== 'file') {
        return;
      }

      resizeFiles.push({
        origin: file.getAsFile(),
        resize: await resize.do(file.getAsFile()),
      });

      resizeFiles.length === files.length && this.renderTable(resizeFiles);
    });
  };
  handleDragOver = event => {
    event.preventDefault();
  };

  setEvent() {
    this.panelEl.addEventListener('drop', this.handleDrop);
    this.panelEl.addEventListener('dragover', this.handleDragOver);
  }
}

new App();
