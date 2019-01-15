import SocketClient from "../src"

let socket;

before(async () => {
  socket = new SocketClient({path: 'https://1win.pro/'}) 
  await socket.connect();
  global.socket = socket
})

after(async () => {
    socket.disconnect();
})