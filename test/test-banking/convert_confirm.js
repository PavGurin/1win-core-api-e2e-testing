import {expect} from 'chai';
import {userList} from '../../src/userList';

describe.skip('Сonvert confirm', () => {

    it('Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-confirm', {code: 7446561});
        console.log(data);
        expect(data.message).equal(undefined);
    });
});
