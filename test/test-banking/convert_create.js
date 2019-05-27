import { expect } from "chai"


describe("Convert", () => {


    it("Create before login", async () => {
        //await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 100,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create before login not enough money", async () => {
        //await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 0,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 100 RUB -> USD", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 100,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 1 USD -> RUB ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 1,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 1 USD -> USD ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 1,
            senderCurrency: 'USD',
            receiverCurrency: 'USD',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 1 RUB -> RUB ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 1,
            senderCurrency: 'RUB',
            receiverCurrency: 'RUB',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 100 RUB -> RUB ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 100,
            senderCurrency: 'RUB',
            receiverCurrency: 'RUB',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 10000 RUB -> USD(not enough money) ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 10000,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD',
        });
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it("Create after login valid request 1000 USD -> RUB(not enough money) ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 1000,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request 0.9 USD -> RUB(enough money) ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: 0.9,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request negative amount USD -> RUB(enough money) ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: -0.9,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("Create after login valid request negative amount RUB -> USD(enough money) ", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:convert-create",{
            amount: -100.9,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD',
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });


});
