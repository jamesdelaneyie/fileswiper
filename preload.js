const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    files: () => ipcRenderer.invoke('files'),
    version: () => ipcRenderer.invoke('version'),
    fileDropped: (filenameAndLocation) => ipcRenderer.invoke('file-dropped', filenameAndLocation),
})


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
