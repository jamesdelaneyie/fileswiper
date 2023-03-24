const { contextBridge, ipcRenderer } = require('electron')

window.ipcRenderer = ipcRenderer;


contextBridge.exposeInMainWorld('versions', {
    files: () => ipcRenderer.invoke('files'),
    version: () => ipcRenderer.invoke('version'),
    fileDropped: (filenameAndLocation) => ipcRenderer.invoke('file-dropped', filenameAndLocation),
    undo: () => ipcRenderer.invoke('undo'),
    quit: () => ipcRenderer.invoke('quit'),
    openDialog: () => ipcRenderer.invoke('hey-open-my-dialog-now'),
    folderLocation: (location) => ipcRenderer.on('folderLocation', location)
})

