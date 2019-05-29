import {expect} from 'chai';
import {userList} from '../../src/userList';

describe.skip('deposit requests', () => {

    it('deposit-create-request', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create-request', {paymentType: 'card_rub'});
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('Запрос депозита по хэшу', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-request', {h: 'gjhg'});
        console.log(data);
        expect(data.message).equal(undefined);
    });
});
