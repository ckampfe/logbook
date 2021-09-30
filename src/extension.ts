"use strict";
import * as vscode from "vscode";
import * as fs from "fs";

// register logbook commands commmands
export function activate(context: vscode.ExtensionContext) {
  const todaysLogBook = vscode.commands.registerCommand(
    "extension.openTodaysLogbook",
    doOpenTodaysLogbook
  );

  const openLogbookDirectory = vscode.commands.registerCommand(
    "extension.openLogbookDirectory",
    doOpenLogbookDirectory
  );

  context.subscriptions.push(todaysLogBook, openLogbookDirectory);
}

async function doOpenTodaysLogbook() {
  const config = vscode.workspace.getConfiguration("logbook");
  let logbookDirectory: string = config.get("directory", "");

  if (logbookDirectory === "") {
    return vscode.window.showErrorMessage(
      'Logbook config setting "logbook.directory" cannot be empty!'
    );
  }

  // make sure there's a trailing slash
  const logbookDirectoryWithTrailingSlash = !logbookDirectory.endsWith("/")
    ? logbookDirectory + "/"
    : logbookDirectory;

  const todaysLogbookFile = getFileName();
  const logbookFilePath = logbookDirectoryWithTrailingSlash + todaysLogbookFile;

  fs.exists(logbookFilePath, (fileExists) => {
    if (fileExists) {
      loadFile(logbookFilePath);
    } else {
      createFile(logbookFilePath);
      loadFile(logbookFilePath);
    }
  });
}

async function doOpenLogbookDirectory() {
  const config = vscode.workspace.getConfiguration("logbook");
  const logbookDirectory: string = config.get("directory", "");
  const openInNewWindow: boolean = config.get("openInNewWindow", true);

  if (logbookDirectory === "") {
    return vscode.window.showErrorMessage(
      'Logbook config setting "logbook.directory" cannot be empty!'
    );
  }

  await vscode.commands.executeCommand(
    "vscode.openFolder",
    vscode.Uri.file(logbookDirectory),
    openInNewWindow // whether the logbook directory should open in a new window or not.
  );
}

function getFileName() {
  const config = vscode.workspace.getConfiguration("logbook");
  let logbookMode: string = config.get("mode", "daily");
  let logbookPrefix: string = config.get("prefix", "");

  // today's date
  var today = new Date();

  switch (logbookMode) {
    case "weekly":
      var day = today.getDay();
      var diff  = today.getDate() - day + (day == 0 ? -6:1);
      var monday = new Date(today.setDate(diff));
      var date = monday;
      break;

    default:
      var date = today;
      break;
  }

  // build name
  var dateString = date.toISOString().split("T")[0];

  var suffix = ".md";
  return logbookPrefix + dateString + suffix;
}

function createFile(path: string) {
  // `touch`, basically. probably a better way to do this.
  const fd = fs.openSync(path, "w");
  fs.closeSync(fd);
}

function loadFile(path: string) {
  const documentPromise = vscode.workspace.openTextDocument(path);
  documentPromise.then((document) => vscode.window.showTextDocument(document));
}

// this method is called when your extension is deactivated
export function deactivate() {}
