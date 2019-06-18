import {expect} from 'chai';
import {userList} from '../../src/methods/userList';

describe.skip('Convert', () => {

    it('C19340 Create before login', async () => {
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 100,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19341 Create before login not enough money', async () => {
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 0,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19342 Create after login valid request 100 RUB -> USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 100,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19343 Create after login valid request 1 USD -> RUB ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 1,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19344 Create after login valid request 1 USD -> USD ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 1,
            senderCurrency: 'USD',
            receiverCurrency: 'USD'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19345 Create after login valid request 1 RUB -> RUB ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 1,
            senderCurrency: 'RUB',
            receiverCurrency: 'RUB'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19346 Create after login valid request 100 RUB -> RUB ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 100,
            senderCurrency: 'RUB',
            receiverCurrency: 'RUB'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19347 Create after login valid request 10000 RUB -> USD(not enough money) ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 10000,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD'
        });
        // console.log(data);
        expect(data).to.deep.include({status: 403});
        expect(data).to.deep.include({message: 'Недостаточно средств'});
    });

    it('C19348 Create after login valid request 1000 USD -> RUB(not enough money) ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 1000,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19349 Create after login valid request 0.9 USD -> RUB(enough money) ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: 0.9,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19350 Create after login valid request negative amount USD -> RUB(enough money) ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: -0.9,
            senderCurrency: 'USD',
            receiverCurrency: 'RUB'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19351 Create after login valid request negative amount RUB -> USD(enough money) ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-create', {
            amount: -100.9,
            senderCurrency: 'RUB',
            receiverCurrency: 'USD'
        });
        // console.log(data);
        expect(data.message).equal(undefined);
    });
});
