const { contextBridge, ipcRenderer } = require('electron')

//Pass the ipcRenderer to the browser window
window.ipcRenderer = ipcRenderer;

// Get the config from local storage and send it to the main process
const config = JSON.parse(localStorage.getItem('config'));
if(config !== null) {
    ipcRenderer.invoke('config', config);
}

// Get the root folder from local storage and send it to the main process
const rootFolder = JSON.parse(localStorage.getItem('root-folder'));
if(rootFolder !== null) {
    ipcRenderer.invoke('rootFolderStartUp', rootFolder);
}



contextBridge.exposeInMainWorld('fileswiper', {

    selectRootFolder: (locationAndFiles) => ipcRenderer.on('selectRootFolder', locationAndFiles),
    folderLocation: (location) => ipcRenderer.on('folderLocation', location), 
    sendConfig: (config) => ipcRenderer.on('sendConfig', config),
    sendPreviewImage: (previewImage) => ipcRenderer.on('sendPreviewImage', previewImage),  
    sendDocImage: (DocImage) => ipcRenderer.on('sendDocImage', DocImage),
    undo: () => ipcRenderer.invoke('undo'),
    quit: () => ipcRenderer.invoke('quit'),
    //files: (files) => ipcRenderer.invoke('files', files),    
    sendRootFolder: (rootFolder) => ipcRenderer.invoke('sendRootFolder', rootFolder), 
    fileDropped: (filenameAndLocation) => ipcRenderer.invoke('file-dropped', filenameAndLocation),
    openDialog: () => ipcRenderer.invoke('hey-open-my-dialog-now'),
    openRootDialog: () => ipcRenderer.invoke('hey-open-my-root-dialog-now'),
})

