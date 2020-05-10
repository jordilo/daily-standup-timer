import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;

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

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 250,
    alwaysOnTop: true,
    backgroundColor: '#f0f0f0'
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `./../../dist/daily-standup-timer/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}
