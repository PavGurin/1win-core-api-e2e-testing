import { expect } from "chai"

describe("///////////////////profile check auth recovery///////////////////////////", () => {

    it("////////////////////profile recovery mail/////////////////", async () => {
      const { data } = await socket.send("PROFILE:forgot-recovery",{

        account: 'testsocke777@yandex.ru'
    }
    );
    expect(data.message).to.equal(undefined);
    })

      

    it("////////////////////profile recovery phone/////////////////", async () => {
        const { data } = await socket.send("PROFILE:forgot-recovery",{
  
          account: '57544564564976'
      }
      );
      expect(data.message).to.equal(undefined);
    })


})

