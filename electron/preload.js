const path = require('path');
const url = require('url');
// const { ipcRenderer } = require('electron');
// window.ipcRenderer = ipcRenderer;

const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
    // const menu = new Menu()

    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#2f3241'),
        icon: url.format(path.join(__dirname, '/images', '/icon.png')),
        menu: null
    });

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
});