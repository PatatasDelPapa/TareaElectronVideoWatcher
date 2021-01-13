const { dialog, mainWindow } = require('electron').remote


const startBtn = document.getElementById('startBtn');

let path

startBtn.addEventListener('click', function(e) {
    path = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile', 'openDirectory']
      })
    // console.log("AJUAAAAA");
    console.log(path);
})

const stopBtn = document.getElementById('stopBtn');


// stopBtn.onclick = e => {
  
//   startBtn.classList.remove('is-danger');
//   startBtn.innerText = 'Start';
// };
