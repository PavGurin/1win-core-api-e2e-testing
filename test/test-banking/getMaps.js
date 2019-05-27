import {expect} from 'chai';

describe('Get methods map', () => {

    it('Withdrawal methods map with login', async () => {
        await socket.send('USER:auth-login', {login: '123123@mailinator.com', password: '123123'});

        const {data} = await socket.send('BANKING:methods-withdrawal');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Withdrawal methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-withdrawal');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Payment methods map with login', async () => {
        await socket.send('USER:auth-login', {login: 'test_withdrawal@mailinator.com', password: '123123'});

        const {data} = await socket.send('BANKING:methods-payment');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Payment methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-payment');
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
