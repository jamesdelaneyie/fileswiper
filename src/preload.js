const { contextBridge, ipcRenderer } = require('electron')

//Pass the ipcRenderer to the browser window
window.ipcRenderer = ipcRenderer;

contextBridge.exposeInMainWorld('fileswiper', {
    /*
    *   Function in renderer: (args) => function in main.js
    *   invoke: send a message to the main process
    *   on: receive a message from the main process
    */
    // Open Dialogs
    openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
    openRootFolderDialog: () => ipcRenderer.invoke('openRootFolderDialog'),
    // Add new folder to the DOM
    addNewFolder: (folderPath) => ipcRenderer.on('addNewFolder', folderPath), 
    // Send the config to the main process
    sendConfig: (config) => ipcRenderer.invoke('sendConfig', config),
    // Receive config from main process and save it to local storage
    receiveConfig: (config) => ipcRenderer.on('receiveConfig', config),
    // Undo & Quit buttons
    undo: () => ipcRenderer.invoke('undo'),
    quit: () => ipcRenderer.invoke('quit'), 
    // Move a file
    fileDropped: (fileMoveDetails) => ipcRenderer.invoke('fileDropped', fileMoveDetails),
    // Receive the list of files from the main process
    selectRootFolder: (locationAndFiles) => ipcRenderer.on('selectRootFolder', locationAndFiles),
    sendRootFolder: (rootFolder) => ipcRenderer.invoke('sendRootFolder', rootFolder),
    
})

