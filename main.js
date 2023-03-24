const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

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

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const files = []

  fs.readdirSync('/Users/jamesdelaney/Downloads', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name)
  .forEach(item => files.push(item))

  ipcMain.handle('files', () => files)

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

    ipcMain.handle('undo', () => {
        //get last item in fileMoves and move it back
        let lastMove = fileMoves.pop();
        let oldPath = lastMove.newPath;
        let newPath = lastMove.oldPath;
        moveFile(oldPath, newPath);
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
