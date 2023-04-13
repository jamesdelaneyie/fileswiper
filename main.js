const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')
const sound = require("sound-play");
const chokidar = require("chokidar");
const electronConnect = require('electron-connect').server;

const thumbnail = require('quicklook-thumbnail');

const filesToIgnore = require('./filesToIgnore.js');

app.setName('FileSwiper');

let fileMoves = []
let rootFolder = null;

function startWatcher(win, location){
  
  var watcher = chokidar.watch(location, {
      ignored: /[\/\\]\./,
      depth: 0,
      ignoreInitial: true,
      persistent: true
  });
        
  // Declare the listeners of the watcher
  watcher.on('add', function(path) {
        //console.log('File', path, 'has been added');
        let files = getFileListFromDirectory(location)   
        win.webContents.send('selectRootFolder', {location: location, files: files});
        //console.log(files)
  }).on('unlink', function(path) {
        //console.log('File', path, 'has been removed');
        let files = getFileListFromDirectory(location)   
        win.webContents.send('selectRootFolder', {location: location, files: files});
  }).on('error', function(error) {
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

function getFileListFromDirectory(dir, sortBy = 'name') {
  let fileList = []
  fs.readdirSync(dir, {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => {
      const name = item.name;
      const stats = fs.statSync(dir + '/' + name);
      const size = stats.size;
      const fileExtension = name.split('.').pop();
      const lastModified = stats.mtime;
      return { name, size, fileExtension, lastModified };
    })
    .forEach(item => fileList.push(item))
  fileList = fileList.filter(item => !filesToIgnore.includes(item.name));
  fileList.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      return a.size - b.size;
    } else if (sortBy === 'lastModified') {
      return a.lastModified - b.lastModified;
    } else if (sortBy === 'fileExtension') {
      return a.fileExtension.localeCompare(b.fileExtension);
    }
  });
  if(sortBy === 'size') {
    fileList.reverse();
  }
  return fileList;
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
      webviewTag: true,
      contextIsolation: true,
    }
  })
  
   
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));




  // Start the Electron-Connect server in development mode
  //if (process.env.NODE_ENV === 'development') {
  //  client = electronConnect.create(win);
  //  client.start();
 // }

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



  

  ipcMain.handle('hey-open-my-dialog-now', () => {
        dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}).then(result => {
            let location = result.filePaths[0];
            win.webContents.send('folderLocation', location);
        }).catch(err => {
            console.log(err)
        })
    });


    const sendFilesToWindow = (win, location, sortBy='name') => {

      let files = getFileListFromDirectory(location, sortBy);
      startWatcher(win, location);

      // make a directory for the thumbnails 
      let thumbnailDir = location + '/.thumbnails';
      if (!fs.existsSync(thumbnailDir)){
        //fs.mkdirSync(thumbnailDir);
      }
      console.log(location)
      console.log(files)
      win.webContents.send('selectRootFolder', {location: location, files: files, sortBy: sortBy});
      if(files.length > 0) {

              var options = {
                size: 512,
                folder: thumbnailDir
          };
          
          //thumbnail.create(location + '/' + files[0].name, options, function(err, result){
          //  if (err) throw (err);
          //  if(result) {
              //var imageAsBase64 = fs.readFileSync(result, 'base64');
              //imageAsBase64 = 'data:image/png;base64,' + imageAsBase64;
              //win.webContents.send('sendPreviewImage', imageAsBase64);
            //}
          //})
      }
      rootFolder = location;
  }


    ipcMain.handle('rootFolderStartUp', (_event, location) => {
      //wait for the window to be ready then send the files
      win.webContents.on('did-finish-load', () => {
        sendFilesToWindow(win, location, 'lastModified');
      })
    })

    ipcMain.handle('sendRootFolder', (_event, location) => {
      console.log('sending updated files')
      sendFilesToWindow(win, location);
    })


    ipcMain.handle('hey-open-my-root-dialog-now', () => {

      dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}).then(result => {

        if(result.filePaths.length > 0) {

          let location = result.filePaths[0];
          sendFilesToWindow(win, location);

        }

      }).catch(err => {
        console.log(err)
      })
    })

    
}

app.whenReady().then(() => {

  protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.substr(7)
    callback(url)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

}).catch((err) => {
  console.log(err)
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    //remove the thumbnails directory
    let thumbnailDir = rootFolder + '/.thumbnails';
    if (fs.existsSync(thumbnailDir)){
      fs.rmdirSync(thumbnailDir, { recursive: true });
    }
    app.quit()
  }
})

try {
  require('electron-reloader')(module);
} catch {}

