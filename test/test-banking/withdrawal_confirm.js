import {expect} from 'chai';
import {userList} from '../../src/userList';

describe.skip('Withdrawal confirm', () => {

    it('Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-confirm', {code: 1070416});
        console.log(data);
        expect(data.message).equal(undefined);
    });
});