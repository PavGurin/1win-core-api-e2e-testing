import { expect } from "chai"
import SocketClient from "../src"


describe("index test", () => {
    let socket;

    before(async () => {
      socket = new SocketClient() 
      await socket.connect();
    })

    it("get casino categories", async () => {
      const { data } = await socket.send('CASINO:categories-all')
      expect(data).to.be.a('array')
    })

    after(async () => {
      socket.disconnect();
    })
})