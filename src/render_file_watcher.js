const { dialog, mainWindow } = require('electron').remote
const chokidar = require('chokidar');

const startBtn = document.getElementById('startBtn');
const watchBtn = document.getElementById('watchBtn');

const videoElement = document.querySelector('video');

let videos = new Set();
let listaReproduccion = [];

let flag = true;
startBtn.addEventListener('click', function(e) {
    // flag = true;
    path = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openDirectory']
      })
    function mirar(path) { 
        if (path) {
            flag = true;
            listaReproduccion = [];
            console.log('cleaning listaReproduccion');
            // console.log(path);
            const watcher = chokidar.watch(path+"/*.mp4", { persistent: true });
            watcher
            .on('add', video_file => {
                console.log(`File ${video_file} has been added`)
                videos.add(video_file);
                listaReproduccion.push(video_file);
                // console.log(listaReproduccion);
            })
            .on('unlink', video_file => {
                console.log(`File ${video_file} has been removed`)
                videos.delete(video_file);
                listaReproduccion = [...videos];
                // console.log(listaReproduccion);
            });
            
            // More possible events.
            watcher
            .on('addDir', video_file => console.log(`Directory ${video_file} has been added`))
            .on('unlinkDir', video_file => console.log(`Directory ${video_file} has been removed`))
            .on('change', video_file => console.log(`File ${video_file} has been changed`))
            .on('error', error => console.log(`Watcher error: ${error}`))
            .on('ready', () => console.log('Initial scan complete. Ready for changes'))
            
        }
    }

    mirar(path);
})

const clearBtn = document.getElementById('clearBtn');

watchBtn.addEventListener('click', function(e) {
    console.log(`Flag is ${flag}`);
    if (flag) {
        if ( listaReproduccion.length !== 0 ) {
            flag = false;
            playVideo();
        } else {
            console.log("No se detectaron archivos mp4 en la carpeta seleccionada");
        }
    } else {
        console.log(listaReproduccion);
    }
});

const listContainer = document.getElementById('listDiv');
const listElement = document.createElement('ol');
const listTitle = document.createElement('h2');
listTitle.innerText = "Siguientes videos";

function makeList() {
    
    // Set up a loop that goes through the items in listItems one at a time
    listContainer.innerHTML = "";
    listElement.innerHTML = "";
    numberOfListItems = listaReproduccion.length;
    let listItem;
    listContainer.appendChild(listTitle);
    listContainer.appendChild(listElement);

    for (i = 0; i < numberOfListItems; ++i) {
        // create an item for each one
        listItem = document.createElement('li');

        // Add the item text
        listItem.innerHTML = listaReproduccion[i];

        // Add listItem to the listElement
        listElement.appendChild(listItem);
    }
}

async function playVideo() {
    console.log(listaReproduccion);
    video = listaReproduccion.shift();
    // console.log(`The video is ${video}`);
    listaReproduccion.push(video);
    // console.log(videos);
    videoElement.src = video;
    makeList();
    await videoElement.play();
}

videoElement.onended = playVideo;

