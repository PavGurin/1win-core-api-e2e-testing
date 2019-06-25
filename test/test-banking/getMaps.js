import {expect} from 'chai';
import {register} from "../../src/methods/register";

describe('Get methods map @master', () => {

    it('C19355 Withdrawal methods map with login', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:methods-withdrawal');
        //console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.placeholder_text.en).equal('Bank card number');
        expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
    });

    it('C19356 Withdrawal methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-withdrawal');
        //console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.placeholder_text.en).equal('Bank card number');
        expect(data.card_rub.placeholder_text.ru).equal('Номер банковской карты');
    });

    it('C19357 Payment methods map with login', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:methods-payment');
        //console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.text.en).equal('Bank card');
        expect(data.card_rub.text.ru).equal('Банковская карта');
    });

    it('C19358 Payment methods map without login', async () => {

        const {data} = await socket.send('BANKING:methods-payment');
        //console.log(data);
        expect(data).to.be.an('object');
        expect(data.card_rub.text.en).equal('Bank card');
        expect(data.card_rub.text.ru).equal('Банковская карта');
    });
});
