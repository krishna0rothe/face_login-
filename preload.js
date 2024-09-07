// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendToken: (token) => ipcRenderer.send("send-jwt-token", token),
  onTokenReceived: (callback) => ipcRenderer.on("token-received", callback),
});
