
const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
let connectCounter = 0;

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client){
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  })
}
function updateUserCount() {
  const userCount = { type: "count", userCount:wss.clients.size};
  wss.broadcast(JSON.stringify(userCount));
};
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  updateUserCount();


  ws.on('message', (message) => {
    let name = 'Bob';
    const receivedMessage = JSON.parse(message);
    let messageObject = {};
    if(receivedMessage.type === 'postNotification'){
      // console.log(receivedMessage.content);
     messageObject = {
        id: uuidv1(),
        content: receivedMessage.content,
        username: receivedMessage.username,
        type: 'incomingNotification'
      };
      console.log(messageObject);
      wss.broadcast(JSON.stringify(messageObject));
    } else if (receivedMessage.type === 'postMessage') {
      console.log('postMessage')
      messageObject = {
        id: uuidv1(),
        content: receivedMessage.content,
        username: receivedMessage.username,
        type: 'incomingMessage'
      }
    console.log(messageObject)
    wss.broadcast(JSON.stringify(messageObject));

    }

    // console.log(receivedMessage.username, receivedMessage.content);
    // console.log('mesOBJ', messageObject);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    updateUserCount();
    });
});