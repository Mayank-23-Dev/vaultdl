const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getPCName: () => ipcRenderer.invoke('get-pc-name'),
  selectFolder: (defaultPath) => ipcRenderer.invoke('select-folder', defaultPath),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
});
