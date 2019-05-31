import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Сonvert confirm', () => {

    it('Incorrect code', async () => {
        userList.login_with_RUB()
        const {data} = await socket.send('BANKING:convert-confirm', {code: 7446561});
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
