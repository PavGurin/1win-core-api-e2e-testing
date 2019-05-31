import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Get methods map', () => {

    it('C19355 Withdrawal methods map with login', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:methods-withdrawal');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.placeholder_text.en).equal('Bank card number');
        expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
    });

    it('C19356 Withdrawal methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-withdrawal');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.placeholder_text.en).equal('Bank card number');
        expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
    });

    it('C19357 Payment methods map with login', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:methods-payment');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.text.en).equal('Bank card');
        expect(data.card_rub.text.ru).equal('Банковская карта');
    });

    it('C19358 Payment methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-payment');
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.text.en).equal('Bank card');
        expect(data.card_rub.text.ru).equal('Банковская карта');
    });
});
