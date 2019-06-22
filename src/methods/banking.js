import {randomStr} from '../randomizer';

export const banking = {

    async transfet_create() {
        return await socket.send('BANKING:transfer-create', {
            targetEmail: randomStr(5) + '_transfet@test.xyz',
            amount: 100,
            currency: 'RUB'
        });
    },

    async withdrawal_create() {
        const result = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        //console.log(JSON.stringify(result, null, 2));
    },


    async deposite_create_rub(amount, wallet, paymentType, currency) {
        const result = await socket.send('BANKING:withdrawal-create', {
            amount: amount,
            wallet: wallet,
            paymentType: paymentType,
            currency: currency,
        });
    },
};


