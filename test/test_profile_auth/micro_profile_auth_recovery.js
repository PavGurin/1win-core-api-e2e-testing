import { expect } from "chai"

describe("Profile check auth recovery", () => {

    it("Profile recovery mail", async () => {
      const { data } = await socket.send("POST:forgot_password",{

        account: 'testsocke777@yandex.ru'
    }
    );
    console.log(data[0]);
    expect(data).to.be.an('array');
    expect(data[0].name).to.be.an('object');
    //expect(data.message).to.equal(undefined);
    })

    it("Profile recovery phone", async () => {
        const { data } = await socket.send("POST:forgot_password",{

          account: '57544564564976'
      }
      );

      expect(data).to.be.an('array');
      expect(data[0].name).to.be.an('object');
      //expect(data.message).to.equal(undefined);
    })

})
