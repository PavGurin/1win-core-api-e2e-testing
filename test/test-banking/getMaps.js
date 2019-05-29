import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Get methods map', () => {

    it('Withdrawal methods map with login', async () => {
        await userList.login_without_money();
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
        await userList.login_without_money();
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
