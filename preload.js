const { contextBridge, ipcRenderer } = require('electron')

window.ipcRenderer = ipcRenderer;

const config = JSON.parse(localStorage.getItem('config'));

ipcRenderer.invoke('config', config);


contextBridge.exposeInMainWorld('versions', {
    undo: () => ipcRenderer.invoke('undo'),
    quit: () => ipcRenderer.invoke('quit'),
    files: () => ipcRenderer.invoke('files'),
    fileDropped: (filenameAndLocation) => ipcRenderer.invoke('file-dropped', filenameAndLocation),
    openDialog: () => ipcRenderer.invoke('hey-open-my-dialog-now'),
    openRootDialog: () => ipcRenderer.invoke('hey-open-my-root-dialog-now'),
    selectRootFolder: (locationAndFiles) => ipcRenderer.on('selectRootFolder', locationAndFiles),
    folderLocation: (location) => ipcRenderer.on('folderLocation', location), 
    sendConfig: (config) => ipcRenderer.on('sendConfig', config),
})

