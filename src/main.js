const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sharp = require('sharp');
const sound = require("sound-play");
const thumbnail = require('quicklook-thumbnail');

const codeFileTypes = require('./modules/codeFileTypes.js');
const getFileListFromDirectory = require('./modules/getFileListFromDirectory.js');
const moveFile = require('./modules/moveFile.js');

const moveSound = path.join(__dirname, '../', 'dist', 'assets', 'move_to.aif');
const trashSound = path.join(__dirname, '../', 'dist', 'assets', 'empty_trash.aif');

let trash;
import('trash').then((module) => {
  trash = module.default;
});

app.setName('FileSwiper');

let fileMoves = []
let rootFolder = null;

function createWindow () {

  /*
	*   Create the app window
	*/
  let win = new BrowserWindow({
    width: 880,
    height: 780,
    minWidth: 400,
    minHeight: 400,
    frame: false,
    //show: false,
    icon: path.join(__dirname, 'dist', 'assets', 'icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../', 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(startUrl);

  

  
  /*
	*   Undo the last file move
	*/
  ipcMain.handle('undo', () => {
      //console.log('undo')
      let lastMove = fileMoves.pop();
      let oldPath = lastMove.newPath;
      let newPath = lastMove.oldPath;
      moveFile(fileMoves, oldPath, newPath, true).then(() => {
        setTimeout(() => {
          //to do - add folder from other direction
          sendFilesToWindow(win, rootFolder, 'name');
        }, 500);
      });
      //console.log(win, rootFolder)
      
  })



  /*
  *   Quit the app
  *   Gets the size and position of the window and sends to renderer to save in local storage
  *   Removes the .thumbnails folder
  */
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


  

  /*
  *   Handle the file dropped event
  */
  ipcMain.handle('fileDropped', (event, fileMoveDetails) => {
   const { filename, location } = fileMoveDetails;

    const oldPath = path.join(rootFolder, filename);
    const newPath = path.join(location, filename);

    if(location === "trash") {
        trash(oldPath);
        fileMoves.push({oldPath: oldPath, newPath: `${process.env.HOME}/.Trash/${filename}`});
        setTimeout(() => {
          sound.play(trashSound);
        }, 250);
    } else {
        moveFile(fileMoves, oldPath, newPath);  
        sound.play(moveSound);  
    }

  })



    /*
    *   Send the initial batch of files to the window when the root folder is selected
    *   It will send a list of 5 files and their properties to the renderer process
    *   @param {string} rootFolderPath - the location of the directory
    *   @param {win} win - the BrowserWindow object
    */
    const sendNextFile = (win, rootFolderPath) => {
    
    }

    

    /*
    *   Send the initial batch of files to the window when the root folder is selected
    *   It will send a list of 5 files and their properties to the renderer process
    *   @param {string} rootFolderPath - the location of the directory
    *   @param {win} win - the BrowserWindow object
    */
    const sendFilesToWindow = async (win, rootFolderPath, sortBy) => {
      let files = getFileListFromDirectory(rootFolderPath, sortBy);
      let filePreviewDir = rootFolderPath + '/.thumbnails';
      // limit the files to the first 5
      files = files.slice(0, 5);
      let fileThumbnailData = [];
    
      // create thumbnail promises for each file
      let thumbnailPromises = files.map(file => {
        let options = {
          size: 1024,
          folder: filePreviewDir
        };
        return new Promise((resolve, reject) => {
          thumbnail.create(rootFolderPath + '/' + file.name, options, function(err, result){
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
                    resolve(imageData);
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
                    resolve(imageData);
                  });
                })
              }
            } else {
              //console.log('error!')
              console.log('Error creating thumbnail')
              reject(err);
              //console.log('Error creating thumbnail')
              //resolve({image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Ug8AAm0BdTu/QFEAAAAASUVORK5CYII=', width: 0, height: 0})
            
            }
          });
        });
      });
    
      try {
        // wait for all thumbnail promises to resolve before sending file data to window
        fileThumbnailData = await Promise.all(thumbnailPromises);
        // add the thumbnail data to the file object
        files = files.map((file, index) => {
          file.thumbnail = fileThumbnailData[index].image;
          file.width = fileThumbnailData[index].width;
          file.height = fileThumbnailData[index].height;
          return file;
        });
        win.webContents.send('selectRootFolder', {location: rootFolderPath, files: files, sortBy: sortBy});
      } catch (error) {
        console.log(error);
      }
    
      rootFolder = rootFolderPath;
    };




    
    /*
    *   Handle sending a new root folder to the DOM who's files will be displayed
    *   @param {string} rootFolderPath - the location of the directory
    *   @param {win} win - the BrowserWindow object
    */

    let configSent = false;

    ipcMain.handle('sendRootFolder', (_event, rootFolderPath) => {
      if(!configSent) {
        win.webContents.on('did-finish-load', () => {
          sendFilesToWindow(win, rootFolderPath, 'name');
          configSent = true;
        })
      } else {
        sendFilesToWindow(win, rootFolderPath, 'name');
      }

      let filePreviewDir = rootFolderPath + '/.thumbnails';
      if (!fs.existsSync(filePreviewDir)){
        fs.mkdirSync(filePreviewDir);
      }
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
        const folderPaths = await dialog.showOpenDialog({ buttonLabel: 'Add Folder', properties: ['multiSelections', 'openDirectory', 'createDirectory' ] });
        //console.log(folderPaths)
        if (folderPaths) {
          folderPaths.filePaths.forEach(folderPath => {
            win.webContents.send('addNewFolder', folderPath);
          })
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

