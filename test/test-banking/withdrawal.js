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
        expect(data["0"].id).equal(163);
        expect(data["0"].time).equal(1559039814000);
        expect(data["0"].payment_system).equal('money-transfer');
        expect(data["0"].amount).equal(100);
        expect(data["0"].status).equal(1);

    });

    it('(-) Get - withdrawal not found - auth', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 205});
        console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Выплата не найдена');

    });

    it('(+) Get - 100 RUB money-transfer -  ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 163});
        console.log(data);
        expect(data.id).equal(163);
        expect(data.time).equal(1559039814000);
        expect(data.payment_system).equal('money-transfer');
        expect(data.amount).equal(100);
        expect(data.status).equal(1);
        expect(data.wallet).equal('417');

    });

    it('(+) Get - 1 RUB card_rub', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 179});
        console.log(data);
        expect(data.id).equal(179);
        expect(data.time).equal(1559126426000);
        expect(data.payment_system).equal('card_rub');
        expect(data.amount).equal(100);
        expect(data.status).equal(0);
        expect(data.wallet).equal('5536913759650035');

    });

    it('(-) Get - 404 not found - unauthorized ', async () => {
        const {data} = await socket.send('BANKING:withdrawal-get', {id: 162});
        console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Выплата не найдена');
    });
});
