import { expect } from "chai"

describe("casino test", () => {

    it("get casino categories", async () => {
      const { data } = await socket.send('CASINO:categories-all')
      expect(data).to.be.a('array')
    })

})