const chokidar = require("chokidar");

const folderWatch = (win, location) => {
  
    var watcher = chokidar.watch(location, {
        ignored: /[\/\\]\./,
        depth: 0,
        ignoreInitial: true,
        persistent: true
    });
          
    // Declare the listeners of the watcher
    watcher.on('add', function(path) {
          //console.log('File', path, 'has been added');
          //let files = getFileListFromDirectory(location)   
          //win.webContents.send('selectRootFolder', {location: location, files: files});
          //console.log(files)
    }).on('unlink', function(path) {
          //console.log('File', path, 'has been removed');
          //let files = getFileListFromDirectory(location)   
          //win.webContents.send('selectRootFolder', {location: location, files: files});
    }).on('error', function(error) {
         console.log('Error happened', error);
    })
  }

module.exports = folderWatch;