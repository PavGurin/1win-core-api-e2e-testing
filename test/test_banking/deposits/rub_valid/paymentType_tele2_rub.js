describe('Create deposite - RUB tele2', () => {

//TODO нужна тестовая симкарта теле2
    import {expect} from "chai";

    it.skip('C19382 RUB - paymentType = tele2_rub and wallet != null @master', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '89772520000',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        //console.log(data);
        expect(data.currency).to.equal('RUB');
    });

});