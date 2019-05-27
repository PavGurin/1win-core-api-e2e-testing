import { expect } from "chai"


describe("withdrawal", () => {


    it("History - Without money", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-history");
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("History - With money", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-history");
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Get - Withdrawal 404 not found - authorized ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-get", {id:205});
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Get - Withdrawal 404 not found - unauthorized ", async () => {

        const { data } = await socket.send("BANKING:withdrawal-get", {id:205});
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
