import { expect } from "chai"
import * as describe from 'mocha';


describe.skip("Сonvert confirm", () => {


    it("Incorrect code", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-confirm",{code:7446561});
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
