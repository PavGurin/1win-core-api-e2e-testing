import {register} from "../../../../src/methods/register";
import {expect} from "chai";

describe.skip('Create deposite - USD @master', () => {

    it('C19385 USD - paymentType = card_rub and wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        //console.log(data);
        expect(data.currency).to.equal('USD');
    });

    it('C19386 Must not pass', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {
            amount: 10,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'USD'
        });
        //console.log(data);
        expect(data.message).to.equal(undefined);
    });

});