const { dialog, mainWindow } = require('electron').remote
const chokidar = require('chokidar');

const startBtn = document.getElementById('startBtn');
const watchBtn = document.getElementById('watchBtn');

const videoElement = document.querySelector('video');

let videos = new Set(); // Some list
let listaReproduccion = [];

let flag = true;
startBtn.addEventListener('click', function(e) {
    path = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openDirectory']
      })
    // console.log("AJUAAAAA");
    // console.log(path);
    function mirar(path) { 
        if (path) {
            let flag = true;
            console.log(path);
            const watcher = chokidar.watch(path+"/*.mp4", { persistent: true });
            watcher
            .on('add', path => {
                console.log(`File ${path} has been added`)
                videos.add(path);
                listaReproduccion.push(path);
            })
            .on('unlink', path => {
                console.log(`File ${path} has been removed`)
                videos.delete(path);
                listaReproduccion = [...videos];
            });
            
            // More possible events.
            watcher
            .on('addDir', path => console.log(`Directory ${path} has been added`))
            .on('unlinkDir', path => console.log(`Directory ${path} has been removed`))
            .on('change', path => console.log(`File ${path} has been changed`))
            .on('error', error => console.log(`Watcher error: ${error}`))
            .on('ready', () => console.log('Initial scan complete. Ready for changes'))

        }
    }

    mirar(path);
})

const clearBtn = document.getElementById('clearBtn');

watchBtn.addEventListener('click', function(e) {
    if (flag) {
        if ( listaReproduccion.length !== 0 ) {
            flag = false;
            playVideo();
        } else {
            console.log("No se detectaron archivos mp4 en la carpeta seleccionada");
        }
    }
});


// const Compare = (arr1, arr2) => {
//     if (arr1.length != arr2.length) {
//       return false
//     }
  
//     let a1 = arr1.map(e => JSON.stringify(e)).sort()
//     let a2 = arr2.map(e => JSON.stringify(e)).sort()
    
//     return !a1.map((e, i) => e == a2[i]).includes(false)
//   }

async function playVideo() {
    console.log(listaReproduccion);
    video = listaReproduccion.shift();
    console.log(`The video is ${video}`);
    listaReproduccion.push(video);
    // console.log(videos);
    videoElement.src = video;
    await videoElement.play();
}

videoElement.onended = playVideo;

// const stopBtn = document.getElementById('stopBtn');

// Initialize watcher.

 
// Add event listeners.



// stopBtn.onclick = e => {
  
//   startBtn.classList.remove('is-danger');
//   startBtn.innerText = 'Start';
// };
