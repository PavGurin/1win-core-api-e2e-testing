import { expect } from "chai"


describe("///////////////////profile check click/mail ///////////////////////////", () => {

    it("////////////////////auth login from 1 click//////////////////", async () => {
      const { data } = await socket.send("PROFILE:auth-login",{login:'rgckho@1win.xyz',password:'55s9ef'});
      expect(data.message).to.equal(undefined);
    })

    it("////////////////////auth login from mail////////////////////", async () => {
        const { data } = await socket.send("PROFILE:auth-login",{login:'testsocke777@yandex.ru',password:'qwerty777'});
        expect(data.message).to.equal(undefined);
    })
      

})

