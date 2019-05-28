import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('withdrawal', () => {

    it('History - Without money', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-history');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('History - With money', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-history');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Get - Withdrawal 404 not found - authorized ', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 205});
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Get - Withdrawal 404 not found - unauthorized ', async () => {

        const {data} = await socket.send('BANKING:withdrawal-get', {id: 205});
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
