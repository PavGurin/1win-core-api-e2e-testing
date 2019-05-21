import { expect } from "chai"

describe("Profile check recovery forgot", () => {


    it("Profile recovery forgot confirm whit incorrect code", async () => {
        const { data } = await socket.send("POST:forgot_password_confirm",{

            userId: 1026429,
            code: 9365724,
            password: 'qwerty777'

        }
        );
        //expect(data.messageLangKey).to.equal('incorrect_request_key');
        expect(data.status).to.equal(400);

    })

})
