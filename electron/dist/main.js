"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
// const server = 'https://daily-standup-timer-updater-hc0v9umil.now.sh/';
// const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//   };
//   dialog.showMessageBox(dialogOpts).then((returnValue) => {
//     if (returnValue.response === 0) { autoUpdater.quitAndInstall(); }
//   });
// });
// autoUpdater.setFeedURL({ url: feed });
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 400,
        height: 250,
        alwaysOnTop: true,
        backgroundColor: '#f0f0f0'
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "./../../dist/daily-standup-timer/index.html"),
        protocol: 'file:',
        slashes: true
    }));
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
//# sourceMappingURL=main.js.map