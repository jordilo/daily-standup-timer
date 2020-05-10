import { app, BrowserWindow , autoUpdater } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;

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
      pathname: path.join(__dirname, `./../dist/daily-standup-timer/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}
