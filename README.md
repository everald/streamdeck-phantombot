# Phantombot Stream Deck Plugin

A plugin for the Stream Deck from elgato to send commands to Phantombot. Grab a release or go through setup and build one on your own.

## Setup

To package a release please download the Distribution Tool from elgato and place it in the tools folder. <https://developer.elgato.com/documentation/stream-deck/sdk/exporting-your-plugin/>

Further instructions are inside the tools folder.

If thats provided than its a simple installation of dependencies and hitting the build command.

```bash
npm install
npm build
```

The generated `.streamDeckPlugin` file can be opened and Stream Deck will ask u if u wanna install it.

## Usage

Adding a command to your Stream Deck requires to go through the Settings first to add Phantombot websocket url and authentication token. When that is done you can add the command to be executed on each button and it should work.

## Known issues

- Settings page does not show already stored settings
- Reconnect on connection loss missing
- Proper status handling

## TODO

- Rewrite sample code in typescript
- Add youtube commands
