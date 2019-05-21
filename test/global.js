import SocketClient from "../src"

let socket;

before(async () => {
  socket = new SocketClient({}) 
  await socket.connect();
  global.socket = socket
})

after(async () => {
    socket.disconnect();
})