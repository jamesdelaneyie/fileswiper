const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron')
const path = require('path')
const fs = require('fs')
const sound = require("sound-play");

app.setName('FileSwiper');

let fileMoves = []
let rootFolder = null;

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
  const files = []
  fs.readdirSync(dir, {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name)
  .forEach(item => files.push(item))
  return files
}

function createWindow () {

  const win = new BrowserWindow({
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

  //open the dev tools
  win.webContents.openDevTools()


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


  let files = []

  ipcMain.handle('rootFolderStartUp', (event, rootFolderReceived) => {
    console.log(rootFolderReceived)
    files = getFileListFromDirectory(rootFolderReceived);
    console.log(files)
    rootFolder = rootFolderReceived;
    let location = rootFolderReceived;
    console.log(location)
    win.webContents.send('selectRootFolder', {location: location, files: files});
  })


  ipcMain.handle('file-dropped', (event, filenameAndLocation) => {
    let filename = filenameAndLocation.filename;
    let location = filenameAndLocation.location;

    //console.log(filename)
    //console.log(location)
    //console.log(rootFolder)

    if(location === "trash") {
        import('trash').then((module) => {
            const trash = module.default;
            trash(rootFolder + `/${filename}`);
            sound.play("empty_trash.aif");
            fileMoves.push({oldPath: rootFolder + `/${filename}`, newPath: `${process.env.HOME}/.Trash/${filename}`});
            return;
        });
    } else {
        let oldPath = rootFolder + `/${filename}`;
        let newPath = `${location}/${filename}`;
    
        moveFile(oldPath, newPath);  
        //sound.play("move_to.aif");  
    }

  })

  ipcMain.handle('sendRootFolder', (event, saveRootFolder) => {
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
      })*/
    }


  })


  

  ipcMain.handle('hey-open-my-dialog-now', () => {
        dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}).then(result => {
            let location = result.filePaths[0];
            win.webContents.send('folderLocation', location);
        }).catch(err => {
            console.log(err)
        })
    });

    
    ipcMain.handle('hey-open-my-root-dialog-now', () => {
      dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}).then(result => {
        let location = result.filePaths[0];
        rootFolder = location;
        let files = getFileListFromDirectory(location);
        //remove ._data.txt from files
        files = files.filter(item => item !== '._data.txt')
        //remove .DS_Store from files
        files = files.filter(item => item !== '.DS_Store')
        //remove .localized from files
        files = files.filter(item => item !== '.localized')

        win.webContents.send('selectRootFolder', {location: location, files: files});

        //if file is doc or pdf then show preview
        if(files[0].includes('.doc') || files[0].includes('.pdf')) {
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
        }

      }).catch(err => {
        console.log(err)
      })
    })

    

  win.loadFile('index.html')
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
