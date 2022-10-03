const { app, BrowserWindow } = require('electron');
const path = require('path');
 
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: { preload: path.join(__dirname, 'preload.js') } //페이지가 표시되기 전  실행할 전처리 코드 경로. 반드시 절대 경로로 지정해야함
    });
 
    win.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
            (d, c)=>{
            if(d.responseHeaders['X-Frame-Options']){
                delete d.responseHeaders['X-Frame-Options'];
            } else if(d.responseHeaders['x-frame-options']) {
                delete d.responseHeaders['x-frame-options'];
            }

            c({cancel: false, responseHeaders: d.responseHeaders});
        }
    );

    win.loadFile('index.html'); //window에 표시 할 html 문서
};
 
app.whenReady().then(() => { //application이 준비된 후 실행할 스크립트
    createWindow();
 
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
