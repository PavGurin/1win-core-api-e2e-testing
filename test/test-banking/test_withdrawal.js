import { expect } from "chai"


describe("withdrawal - history", () => {


    it("Without money", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-history");
        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it("With money", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-history");
        console.log(data);
        expect(data.message).to.equal(undefined);
    })

});
