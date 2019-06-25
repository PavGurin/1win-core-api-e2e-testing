import {randomStr} from '../randomizer';

export const banking = {

    async transfer_create(amount, currency) {
        return await socket.send('BANKING:transfer-create', {
            targetEmail: randomStr(5) + '_transfet@test.xyz',
            amount: amount,
            currency: currency
        });
    },

    async withdrawal_create(amount, wallet, payment_system, currency) {
        return await socket.send('BANKING:withdrawal-create', {
            amount: amount,
            wallet: wallet,
            payment_system: payment_system,
            currency: currency,
        });
        //console.log(JSON.stringify(result, null, 2));
    },

    async deposite_create_rub(amount, wallet, paymentType, currency) {
        return await socket.send('BANKING:deposit-create', {
            amount: amount,
            wallet: wallet,
            paymentType: paymentType,
            currency: currency,
        });
    },

    async deposit_create_request(amount, wallet, paymentType, currency) {
        return await socket.send('BANKING:deposit-create-request', {
            amount: amount,
            wallet: wallet,
            paymentType: paymentType,
            currency: currency
        });
    },
};


