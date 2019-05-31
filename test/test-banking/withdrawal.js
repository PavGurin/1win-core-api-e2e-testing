import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Withdrawal', () => {

    it('(+) History - Without withdrawal', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-history');
        console.log(data);
        expect(data.length).equal(0);
    });

    it('(+) History - With withdrawal', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-history');
        console.log(data);
        expect(data["0"].amount, data["0"].id, data["0"].payment_system, data["0"].status, data["0"].time).equal(100, 163, 'money-transfer', 1, 1559039814000);
    });

    it('(-) Get - withdrawal not found - auth', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 205});
        console.log(data);
        expect(data.status, data.message).equal(404, 'Выплата не найдена');

    });

    it('(+) Get - 100 RUB money-transfer -  ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 163});
        console.log(data);
        expect(data.amount, data.currency, data.date, data.device, data.id, data.id_user, data.merchant_invoice_id,
            data.merchant_is_checked, data.merchant_name, data.merchant_operation_id, data.payed_amount, data.payment_system,
            data.status, data.time, data.time_confirm, data.wallet).equal(100, 'RUB', '2019-05-28T00:00:00.000Z', null, 163, 205, null, 0, null, null, 0, 'money-transfer', 1,
            '2019-05-28T13:36:54.000Z', '1971-01-01T00:00:00.000Z', '417');

    });

    it('(+) Get - 1 RUB card_rub', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 179});
        console.log(data);
        expect(data.amount, data.currency, data.date, data.device, data.id, data.id_user, data.merchant_invoice_id,
            data.merchant_is_checked, data.merchant_name, data.merchant_operation_id, data.payed_amount, data.payment_system,
            data.status, data.time, data.time_confirm, data.wallet).equal(100, 'RUB', '2019-05-29T00:00:00.000Z', null, 179, 205, null, 0, null, null, 0, 'card_rub', 0,
            '2019-05-29T13:40:26.000Z', '1971-01-01T00:00:00.000Z', '5536913759650035');

    });

    it('(-) Get - 404 not found - unauthorized ', async () => {
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 162});
        console.log(data);
        expect(data.status, data.message).equal(404, 'Выплата не найдена');
    });
});
