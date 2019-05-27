import { expect } from "chai"

describe.skip("Profile check recovery forgot", () => {


    it("Profile recovery forgot confirm whit incorrect code", async () => {
        const { data } = await socket.send("POST:forgot_password_confirm",{

            userId: 1460970,
            code: 1630984,
            password: '123321123321',
            repeat_password: '123321123321'

        }
        );
        //expect(data.messageLangKey).to.equal('incorrect_request_key');
        expect(data.status).to.equal(400);

    })

})
