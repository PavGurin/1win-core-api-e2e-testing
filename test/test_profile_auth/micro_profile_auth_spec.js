import { expect } from "chai"


describe("Profile check click/mail", () => {

    it("Auth login from 1 click", async () => {
      const { data } = await socket.send("POST:login",{login:'rgckho@1win.xyz',password:'55s9ef'});
      expect(data.message).to.equal(undefined);
    })

    it("Auth login from mail", async () => {
        const { data } = await socket.send("POST:login",{login:'testsocke777@yandex.ru',password:'qwerty777'});
        expect(data.message).to.equal(undefined);
    })

})
