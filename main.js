const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')
const sound = require("sound-play");
const chokidar = require("chokidar");
const electronConnect = require('electron-connect').server;
// load in the filesToIgnore.js file
const filesToIgnore = require('./filesToIgnore.js');

console.log(filesToIgnore)

app.setName('FileSwiper');

let fileMoves = []
let rootFolder = null;

function startWatcher(win, path){
  
  var watcher = chokidar.watch(path, {
      ignored: /[\/\\]\./,
      depth: 0,
      ignoreInitial: false,
      persistent: true
  });
        
  // Declare the listeners of the watcher
  watcher
  .on('add', function(path) {
        //console.log('File', path, 'has been added');
        let files = getFileListFromDirectory(rootFolder)   
        win.webContents.send('selectRootFolder', {location: rootFolder, files: files});
        //console.log(files)
  })
  .on('unlink', function(path) {
       //console.log('File', path, 'has been removed');
        let files = getFileListFromDirectory(rootFolder)   
        win.webContents.send('selectRootFolder', {location: rootFolder, files: files});
  })
  .on('error', function(error) {
       console.log('Error happened', error);
  })
}

function moveFile(oldPath, newPath) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        copy();
      } else {
        console.log(err);
      }
      return;
    }
    fs.utimesSync(newPath, new Date(), new Date());
    fileMoves.push({oldPath: oldPath, newPath: newPath});
  })

}

function getFileListFromDirectory(dir) {
  let fileList = []
  fs.readdirSync(dir, {withFileTypes: true}).filter(item => !item.isDirectory()).map(item => item.name).forEach(item => fileList.push(item))
  fileList = fileList.filter(item => !filesToIgnore.includes(item));
  return fileList
}

function createWindow () {

  let client;

  let win = new BrowserWindow({
    width: 900,
    height: 780,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
     // enableRemoteModule: true,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
    }
  })
   
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

   // Open the DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  // Start the Electron-Connect server in development mode
  if (process.env.NODE_ENV === 'development') {
    client = electronConnect.create(win);
    client.start();
  }

  //open the dev tools
  win.webContents.openDevTools()

  let files = []




  // Cleanup when the window is closed
  win.on('closed', () => {
    win = null;
    if (client) {
      client.stop();
      client = null;
    }
  });


  ipcMain.handle('config', (event, config) => {
    win.setSize(config.width, config.height);
    win.setPosition(config.x, config.y);
  })

  // undo the last move 
  ipcMain.handle('undo', () => {
      let lastMove = fileMoves.pop();
      let oldPath = lastMove.newPath;
      let newPath = lastMove.oldPath;
      moveFile(oldPath, newPath);
  })

  // quit the app
  ipcMain.handle('quit', () => {
      const size = win.getSize(); // returns an array [width, height]
      const position = win.getPosition();
      const config = {
        width: size[0],
        height: size[1],
        x: position[0],
        y: position[1]
      }
      win.webContents.send('sendConfig', config);
      app.quit();
  })


  


  ipcMain.handle('file-dropped', (event, filenameAndLocation) => {
    let filename = filenameAndLocation.filename;
    let location = filenameAndLocation.location;

    //console.log(filename)
    //console.log(location)
    //console.log(rootFolder)

    let oldPath = rootFolder + `/${filename}`;
    let newPath = `${location}/${filename}`;

    if(oldPath === newPath) {
        console.log('same location')
        return;
    }

    if(location === "trash") {
        import('trash').then((module) => {
            const trash = module.default;
            trash(rootFolder + `/${filename}`);
            sound.play("empty_trash.aif");
            fileMoves.push({oldPath: rootFolder + `/${filename}`, newPath: `${process.env.HOME}/.Trash/${filename}`});
        });
    } else {
        
        moveFile(oldPath, newPath);  
        //sound.play("move_to.aif");  
    }

  })

  /*ipcMain.handle('sendRootFolder', (event, saveRootFolder) => {
    let location = saveRootFolder;
    console.log(location)
    win.webContents.send('selectRootFolder', {location: location, files: files});
    
    if(files[0].includes('.doc') || files[0].includes('.pdf')) {
      //win.webContents.send('sendDocImage', files[0]);
    } else {
      /*
      const w = new BrowserWindow({ show: false })

      let URLtoLoad = 'file:///' + result.filePaths[0] + '/' + files[0]
      URLtoLoad = encodeURI(URLtoLoad)
      //console.log(URLtoLoad)
      w.loadURL(URLtoLoad)
      //console.log('loading')
      w.webContents.on('did-finish-load', async() => {
          //console.log('did-finish-load')
          let image = await w.webContents.capturePage()
          //console.log(image.toDataURL())
          win.webContents.send('sendPreviewImage', image.toDataURL());
      })
    }


  })*/


  

  ipcMain.handle('hey-open-my-dialog-now', () => {
        dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}).then(result => {
            let location = result.filePaths[0];
            win.webContents.send('folderLocation', location);
        }).catch(err => {
            console.log(err)
        })
    });


    const sendFilesToWindow = (win, location) => {
      let files = getFileListFromDirectory(location);
      startWatcher(win, location);
      console.log("sending files to window")
      win.webContents.send('selectRootFolder', {location: location, files: files});
      //rootFolder = location;
  }


    ipcMain.handle('rootFolderStartUp', (_event, location) => {
      //wait for the window to be ready then send the files
      win.webContents.on('did-finish-load', () => {
        sendFilesToWindow(win, location);
      })
    })


    ipcMain.handle('hey-open-my-root-dialog-now', () => {

      dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}).then(result => {

        if(result.filePaths.length > 0) {

          let location = result.filePaths[0];
          sendFilesToWindow(win, location);

          //if file is doc or pdf then show preview
          /*if(files[0].includes('.doc') || files[0].includes('.pdf')) {
            win.webContents.send('sendDocImage', files[0]);
          } else {

            const w = new BrowserWindow({ show: false })

            let URLtoLoad = 'file:///' + result.filePaths[0] + '/' + files[0]
            URLtoLoad = encodeURI(URLtoLoad)
            //console.log(URLtoLoad)
            w.loadURL(URLtoLoad)
            //console.log('loading')
            w.webContents.on('did-finish-load', async() => {
                //console.log('did-finish-load')
                let image = await w.webContents.capturePage()
                //console.log(image.toDataURL())
                win.webContents.send('sendPreviewImage', image.toDataURL());
            })
          }*/
        }

      }).catch(err => {
        console.log(err)
      })
    })

    
}

app.whenReady().then(() => {

  protocol.registerFileProtocol('atom', (request, callback) => {
    //console.log(request.url)
    const url = request.url.substr(7)
    callback(url)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

try {
    require('electron-reloader')(module)
  } catch (_) {}
