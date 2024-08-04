// https://github.com/young/fullstack-for-frontend3/blob/main/apps/database/index-ws.js

const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);

server.listen(PORT, function () { console.log('Listening on http://localhost:' + PORT); });

// when server closes, shutdown websocket and database
process.on('SIGINT', () => {
  console.log('shutting down server')

  wss.clients.forEach(function each(client) {
    console.log('shutting down websocket')
    client.close();
  })

  server.close(() => {
    shutdownDB();
  })
})

/** Websocket **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;

  console.log('clients connected: ', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  // when websocket connection is open
  if (ws.readyState === ws.OPEN) {
    ws.send('welcome!');
  }

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))
  `)

  // when websocket  connection is closed
  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
/** End Websocket **/

/** begin database */

const sqlite = require('sqlite3')

// create database in memory. if server restarts, db is destroyed
const db = new sqlite.Database(':memory:')

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `)
})

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row)
  })
}

function shutdownDB() {
  getCounts();
  console.log('shutting down db')
  db.close()
}
