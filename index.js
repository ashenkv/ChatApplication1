// Websocket පුස්තකාලය (library) import කරගන්නවා
const WebSocket = require('ws');

// අලුත් Websocket server එකක් හදනවා.
// මේක Port 8080 එකේ වැඩ කරනවා.
const wss = new WebSocket.Server({ port: 8080 });

// සම්බන්ධ වුණු හැම client කෙනෙක්වම තියාගන්න Array එකක්
const clients = [];

// අලුත් client කෙනෙක් සම්බන්ධ වුණු හැම වෙලාවෙම මේ function එක run වෙනවා
wss.on('connection', ws => {
  console.log('Client connected!');
  
  // අලුත් client ව clients array එකට එකතු කරනවා
  clients.push(ws);

  // client කෙනෙක්ගෙන් message එකක් ආවොත්
  ws.on('message', message => {
    console.log(`Received: ${message}`);

    // ආපු message එක අනිත් හැම client කෙනෙක්ටම යවනවා (broadcast)
    clients.forEach(client => {
      // client සම්බන්ධතා විවෘතව තියෙනවද කියලා බලනවා
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // client කෙනෙක් විසන්ධි වුනොත්
  ws.on('close', () => {
    console.log('Client disconnected');
    
    // විසන්ධි වුණු client ව array එකෙන් අයින් කරනවා
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  // error එකක් ආවොත්
  ws.on('error', error => {
    console.error('WebSocket Error:', error);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');