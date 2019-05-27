import { expect } from "chai"

describe("Profile check auth recovery", () => {

    it("Profile recovery mail", async () => {
      const { data } = await socket.send("POST:forgot_password",{

        account: '123123@mailinator.com'
    }
    );
    console.log(data[0]);
    //expect(data).to.be.an('array');
    expect(data).to.be.an('object');

    //expect(data.message).to.equal(undefined);
    })

/* Сейчас восстановление пароля только по email
    it("Profile recovery phone", async () => {
        const { data } = await socket.send("POST:forgot_password",{

          account: '+79995654565'
      }
      );

      expect(data).to.be.an('array');
      expect(data[0].name).to.be.an('object');
      //expect(data.message).to.equal(undefined);
    })
*/
})
