import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Сonvert confirm', () => {

    it('C19352 (-) Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-confirm', {code: 7446561});
        // console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Not found');
    });
});
