const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sharp = require('sharp');
const sound = require("sound-play");

const thumbnail = require('quicklook-thumbnail');


const codeFileTypes = require('./codeFileTypes.js');
const getFileListFromDirectory = require('./getFileListFromDirectory.js');
const moveFile = require('./moveFile.js');

app.setName('FileSwiper');

let fileMoves = []
let rootFolder = null;



function createWindow () {

  let win = new BrowserWindow({
    width: 880,
    height: 780,
    minWidth: 400,
    minHeight: 400,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  // Load the index.html of the app from the dist folder
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(startUrl);
  

  // undo the last move 
  ipcMain.handle('undo', () => {
      let lastMove = fileMoves.pop();
      let oldPath = lastMove.newPath;
      let newPath = lastMove.oldPath;
      moveFile(oldPath, newPath);
  })

  // quit the app
  ipcMain.handle('quit', () => {
      const size = win.getSize(); 
      const position = win.getPosition();
      const config = {
        width: size[0],
        height: size[1],
        x: position[0],
        y: position[1]
      }
      win.webContents.send('receiveConfig', config);
      let thumbnailDir = rootFolder + '/.thumbnails';
      if (fs.existsSync(thumbnailDir)){
        fs.rmdirSync(thumbnailDir, { recursive: true });
      }
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
        sound.play("move_to.aif");  
    }

  })



  

    


    const sendFilesToWindow = (win, location, sortBy) => {

      let files = getFileListFromDirectory(location, sortBy);
      
      //startWatcher(win, location);

      // make a directory for the thumbnails 
      let thumbnailDir = location + '/.thumbnails';
      if (!fs.existsSync(thumbnailDir)){
        fs.mkdirSync(thumbnailDir);
      }

      win.webContents.send('selectRootFolder', {location: location, files: files, sortBy: sortBy});
      
      if(files.length > 0) {

          var options = {
                size: 1024,
                folder: thumbnailDir
          };
          
          try {
            thumbnail.create(location + '/' + files[0].name, options, function(err, result){
              if(result) {
                var imageAsBase64 = fs.readFileSync(result, 'base64');
                var buffer = Buffer.from(imageAsBase64, 'base64');

                if(codeFileTypes.includes(files[0].fileExtension)) {
                  sharp(buffer).trim().toBuffer().then(data => {
                    //add padding to the image
                    var imageAsBase64 = data.toString('base64');
                    imageAsBase64 = 'data:image/png;base64,' + imageAsBase64;
                    var image = sharp(data);
                    image.metadata().then(function(metadata) {
                      var width = metadata.width;
                      var height = metadata.height;
                      var imageData = {image: imageAsBase64, width: width, height: height};
                      // Store the image data in a variable
                      sendPreview(imageData);
                    });
                  })

                } else {
                  sharp(buffer).toBuffer().then(data => { 
                    var imageAsBase64 = data.toString('base64');
                    imageAsBase64 = 'data:image/png;base64,' + imageAsBase64;
                    var image = sharp(data);
                    image.metadata().then(function(metadata) {
                      var width = metadata.width;
                      var height = metadata.height;
                      var imageData = {image: imageAsBase64, width: width, height: height};
                      // Store the image data in a variable
                      sendPreview(imageData);
                    });
                  })

                }
                
                
              }
            })
          } catch (error) {
            console.log(error)
          }

          function sendPreview(imageData) {
            win.webContents.send('sendPreviewImage', imageData);
          }
          
      }
      rootFolder = location;
  }




    
    /*
    *   Handle sending a new root folder to the DOM who's files will be displayed
    *   It will send a list of 5 files and their properties to the renderer process
    *   @param {string} rootFolderPath - the location of the directory
    *   @param {win} win - the BrowserWindow object
    */
    ipcMain.handle('sendRootFolder', (_event, rootFolderPath) => {
      win.webContents.on('did-finish-load', () => {
        sendFilesToWindow(win, rootFolderPath, 'name');
      })
    })


    /*
    *   Handle receiving the config from the renderer process on startup
    *   Set the size and position of the window and then show it
    *   @param {object} config - the width, height, x, and y of the window
    */
    ipcMain.handle('sendConfig', (event, config) => {
      if(config) {
        win.setSize(config.width, config.height);
        win.setPosition(config.x, config.y);
      } 
      win.show();
    })


    /*
    *   Handle sending a new folder to the DOM as a bucket
    *   It will send the folder location to the renderer process
    *   to be added to the DOM and saved in the local storage
    *   @param {string} folderPath - the location of the directory
    */
    ipcMain.handle('openFolderDialog', async () => {
      try {
        const { filePaths: [folderPath] } = await dialog.showOpenDialog({ buttonLabel: 'Add Folder', properties: ['openDirectory', 'createDirectory'] });
        if (folderPath) {
          win.webContents.send('AddNewFolder', folderPath);
        }
      } catch (error) {
        console.log(error);
      }
    });

    /*
    *   Handle sending a new root folder to the DOM who's files will be displayed
    *   It will send a list of 5 files and their properties to the renderer process
    *   @param {string} rootFolderPath - the location of the directory
    *   @param {win} win - the BrowserWindow object
    */
    ipcMain.handle('openRootFolderDialog', async () => {
      try {
        const { filePaths: [rootFolderPath] } = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });
        if (rootFolderPath) {
          sendFilesToWindow(win, rootFolderPath);
        }
      } catch (error) {
        console.log(error);
      }
    });

    
}

app.whenReady().then(() => {

  createWindow()


}).catch((err) => {
  console.log(err)
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

try {
  require('electron-reloader')(module);
} catch {}

