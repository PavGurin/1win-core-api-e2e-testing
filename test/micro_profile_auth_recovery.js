import { expect } from "chai"

describe("///////////////////profile check recovery///////////////////////////", () => {

    it("////////////////////profile recovery/////////////////", async () => {
      const { data } = await socket.send("PROFILE:forgot-recovery",{

        account: 'testsocke777@yandex.ru'
    }
    );
    
     // expect(data).to.be.a('array')
      console.log(data);
    })

      

})

