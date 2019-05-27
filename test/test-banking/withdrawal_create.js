import { expect } from "chai"


describe("Withdrawal create", () => {


    it("Without money", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-create",{amount: "100", wallet: "5446546", payment_system: "card_rub", currency: 'RUB'});
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("With money", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-create",{amount: "100", wallet: "5446546", payment_system: "card_rub", currency: 'RUB'});
        console.log(data);
        expect(data.message).equal(undefined);
    })

});
