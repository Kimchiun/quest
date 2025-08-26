import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  saveFile: async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    return ipcRenderer.invoke('save-file', {
      name: file.name,
      buffer: arrayBuffer,
      type: file.type,
    });
  },
}); 