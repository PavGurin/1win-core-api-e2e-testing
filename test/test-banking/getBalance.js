import {expect} from 'chai';

describe('Balance get', () => {

    it('Without money', async () => {
        await socket.send('USER:auth-login', {login: '123123@mailinator.com', password: '123123'});

        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money only rub', async () => {
        await socket.send('USER:auth-login', {login: 'test_withdrawal@mailinator.com', password: '123123'});

        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money rub + usd', async () => {
        await socket.send('USER:auth-login', {login: 'test_withdrawal2@mailinator.com', password: '123123'});

        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
