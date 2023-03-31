"strict mode"

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

app.setName('FileSwiper');

let fileMoves = []

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
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })


  ipcMain.handle('config', (event, config) => {

    console.log("received config")

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
      console.log(config)
      console.log("sending config")
      win.webContents.send('sendConfig', config);
      app.quit();
  })

  // set the root folder

  //win.setAlwaysOnTop(true, "floating");
  const files = []
  fs.readdirSync('/Users/jamesdelaney/Downloads', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name)
  .forEach(item => files.push(item))
  
  ipcMain.handle('files', () => files)

  /*ipcMain.handle('files', (event, rootFolder) => {
    console.log(rootFolder)
    let files = getFileListFromDirectory(rootFolder);
    return files;
  })*/


  ipcMain.handle('file-dropped', (event, filenameAndLocation) => {
    let filename = filenameAndLocation.filename;
    let location = filenameAndLocation.location;


    if(location === "trash") {
        import('trash').then((module) => {
            const trash = module.default;
            trash(`/Users/jamesdelaney/Downloads/${filename}`);
            fileMoves.push({oldPath: `/Users/jamesdelaney/Downloads/${filename}`, newPath: `${process.env.HOME}/.Trash/${filename}`});
            return;
        });
    } else {
        let oldPath = `/Users/jamesdelaney/Downloads/${filename}`;
        let newPath = `${location}/${filename}`;
    
        moveFile(oldPath, newPath);    
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
        let files = getFileListFromDirectory(location);
        win.webContents.send('selectRootFolder', {location: location, files: files});
      }).catch(err => {
        console.log(err)
      })
    })

    

  win.loadFile('index.html')
}

app.whenReady().then(() => {
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
