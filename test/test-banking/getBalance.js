import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Balance get', () => {

    it('Without money', async () => {
        userList.login_without_money();
        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money only rub', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('With money rub + usd', async () => {
        userList.login_with_RUB();
        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
