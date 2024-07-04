const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setCookie: (name, value, options) => {
    document.cookie = `${name}=${value}; ${options}`;
  },
});
