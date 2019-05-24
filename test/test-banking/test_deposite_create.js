import { expect } from "chai"


describe("RUB/USD - Create deposite", () => {



    it("RUB - Create deposite paymentType = card_rub and wallet = null", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:deposit-create",{

                amount: 100,
                wallet: '',
                paymentType: 'card_rub',
                currency: 'RUB'
            } );
        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it("USD - Create deposite paymentType = card_rub and wallet = null", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:deposit-create",{

                amount: 100,
                wallet: '',
                paymentType: 'card_rub',
                currency: 'USD'
            } );
        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it("Create deposite - must not pass", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:deposit-create",{
            userId: 156,

                amount: 10,
                wallet: '',
                paymentType: 'card_rub',
                currency: 'USD'
            } );

        console.log(data);
        expect(data.message).to.equal(undefined);
    });

    it("Auth login from mail", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:withdrawal-history");
        console.log(data);
        expect(data.message).to.equal(undefined);
    })

});
