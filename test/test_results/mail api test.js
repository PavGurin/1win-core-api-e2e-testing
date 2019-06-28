import {expect} from "chai"
import {mail} from '../../src/methods/mail'

describe("mail api test", () => {

    it("mail api test", async () => {
        const received = await mail.get_message("fodiwotitu@virtualemail.info");
        await console.log("Код = " + received.code);

    })

})