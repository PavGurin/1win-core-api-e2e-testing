import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Get methods map', () => {

    it('Withdrawal methods map with login', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:methods-withdrawal');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.placeholder_text.en).equal('Bank card number');
        expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
    });

    it('Withdrawal methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-withdrawal');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.placeholder_text.en).equal('Bank card number');
        expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
    });

    it('Payment methods map with login', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:methods-payment');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.text.en).equal('Bank card');
        expect(data.card_rub.text.ru).equal('Банковская карта');
    });

    it('Payment methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-payment');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.text.en).equal('Bank card');
        expect(data.card_rub.text.ru).equal('Банковская карта');
    });
});
