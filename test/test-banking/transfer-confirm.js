import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Transfer confirm', () => {

    it('(-) Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-confirm', {code: 5372831});
        console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Перевод не найден');
    });
});
