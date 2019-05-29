import {expect} from 'chai';
import {userList} from '../../src/userList';

describe.skip('Transfer confirm', () => {

    it('Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-confirm', {code: 5372831});
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
