# logbook README

A simple way to keep logs of your daily work.

## Features

* `Logbook: Open Today's Logbook`: open a blank file named `YYYY-MM-DD.md` where year, month, and day are sourced from the local datetime. This file will be opened if it exists, and created in the `logbook.directory` if it does not.
* `Logbook: Open Logbook Directory`: open the `logbook.directory`. Defaults to opening in a new window, but can be set to take over the current window.

## Requirements

Before use, you must set the `logbook.directory` to a directory where you wish to store your logbook files.
The extension will show an error message and will not function if this setting has not been set.

## Extension Settings

* `logbook.directory`: the directory where your logbook files are stored. This cannot be empty/null.
* `logbook.openInNewWindow`: whether to open the logbook directory in a new window. Defaults to true.

## Known Issues

## Release Notes

### 0.0.1

Hello, World!