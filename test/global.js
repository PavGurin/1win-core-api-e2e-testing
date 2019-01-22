import SocketClient from "../src"

let socket;

before(async () => {
  socket = new SocketClient({path: 'https://1win.pro/'}) 
 // socket = new SocketClient({path: 'http://176.9.17.49:9090'}) 
  await socket.connect();
  global.socket = socket
})

after(async () => {
    socket.disconnect();
})