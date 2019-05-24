import { expect } from "chai"


describe("transfer", () => {


    it("transfer - Without money , not enough amount + RUB", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'RUB'
            }
        );
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it("transfer - Without money , not enough amount + USD", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it("transfer - Without money , enough amount + USD", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'USD'
            }
        );
        console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it("transfer - Without money , enough amount + RUB", async () => {
        await socket.send("USER:auth-login",{login:'123123@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it("transfer - With money", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 100,
                currency: 'RUB'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    })

    it("transfer - With money + USD, amount = 1 USD", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 1,
                currency: 'USD'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    })

    it("transfer - With money + USD, amount = 2 USD", async () => {
        await socket.send("USER:auth-login",{login:'test_withdrawal@mailinator.com',password:'123123'});

        const { data } = await socket.send("BANKING:transfer-create",{
                targetEmail: 'test_transfer@mailinator.com',
                amount: 2,
                currency: 'USD'
            }
        );
        console.log(data);
        expect(data.message).equal(undefined);
    })

});
