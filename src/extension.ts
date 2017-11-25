'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';

// register logbook commands commmands
export function activate(context: vscode.ExtensionContext) {
    const todaysLogBook =
        vscode.commands.registerCommand('extension.openTodaysLogbook', doOpenTodaysLogbook);

    const openLogbookDirectory =
        vscode.commands.registerCommand('extension.openLogbookDirectory', doOpenLogbookDirectory);

    context.subscriptions.push(
        todaysLogBook,
        openLogbookDirectory
    );
}

async function doOpenTodaysLogbook() {
    const config = vscode.workspace.getConfiguration('logbook');
    let logbookDirectory: string = config.get('directory');

    // make sure there's a trailing slash
    if(!logbookDirectory.endsWith('/')) {
        logbookDirectory = logbookDirectory + '/'
    }

    // today's date
    const date = new Date()
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const todaysLogbookFile = `${year}-${month}-${day}.md`;
    const fullLogBookFile = logbookDirectory + todaysLogbookFile;

    fs.exists(fullLogBookFile, (fileExists) => {
        if(fileExists) {
            loadFile(fullLogBookFile);
        } else {
            createFile(fullLogBookFile);
            loadFile(fullLogBookFile);
        }
    });
}

 async function doOpenLogbookDirectory() {
    const config = vscode.workspace.getConfiguration('logbook');
    const logbookDirectory = vscode.Uri.parse(config.get('directory'));
    const openInNewWindow: boolean = config.get('newWindow');

    await vscode.commands.executeCommand(
        'vscode.openFolder',
        logbookDirectory,
        openInNewWindow // whether the logbook directory should open in a new window or not.
    );
}

function createFile(filename) {
    // `touch`, basically. probably a better way to do this.
    const fd = fs.openSync(filename, 'w');
    fs.closeSync(fd);
}

function loadFile(filename) {
    const documentPromise = vscode.workspace.openTextDocument(filename);
    documentPromise.then((document) => vscode.window.showTextDocument(document));
}

// this method is called when your extension is deactivated
export function deactivate() {
}