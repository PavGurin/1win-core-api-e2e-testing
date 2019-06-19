import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Deposit requests', () => {

    it('C19376 (+) create @master', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create-request', {
            amount: 100,
            wallet: '',
            paymentType: 'card_rub'});
        //console.log(data);
        expect(data.message).equal(undefined);
    });

    it('C19377 (-) with hash', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-request', {h: 'gjhg'});
        // console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Запрос депозита не найден');
    });
});
