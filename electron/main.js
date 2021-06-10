const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { channels } = require('../src/shared/constants');

let mainWindow;

function createWindow () {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    });
    mainWindow = new BrowserWindow({
        minWidth: 400,
        maxWidth: 400,
        minHeight: 640,
        maxHeight: 640,
        // fullscreen: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            experimentalFeatures: true
        }
    });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on(channels.APP_INFO, (event) => {
    event.sender.send(channels.APP_INFO, {
        appName: app.getName(),
        appVersion: app.getVersion(),
    });
});