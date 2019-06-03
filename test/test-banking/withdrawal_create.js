import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Withdrawal create with user without money ', () => {

    function checkErrMsg(data, expStatus, expMessage) {
        expect(data.status).equal(expStatus);
        expect(data.message).equal(expMessage);
    }

    it('C19278 (-) Without money', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad Request.');
    });

    it('C19279 (-) Without money card_rub + valid wallet ', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 403, 'Недостаточно средств');
    });

    it('C19324 (-) With money invalid', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad Request.');
    });

    it('C19325 (+) With money card_rub + valid wallet', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19326 (+) With money card_uah + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_uah',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19327 (+) With money card_uah + valid wallet + USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_uah',
            currency: 'USD'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19328 (+) With money beeline_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'beeline_rub',
            wallet: '+79215645654',
            currency: 'RUB'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19329 (+) With money beeline_rub + valid wallet + USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'beeline_rub',
            wallet: '+79215645656',
            currency: 'USD'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19330 (+) With money megafon_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'megafon_rub',
            wallet: '+79215645656'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19331 (+) With money mts_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'mts_rub',
            wallet: '+79215645656'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19332 (+) With money qiwi_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'qiwi_rub',
            wallet: '+79215645656'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19333 (+) With money tele2_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'tele2_rub',
            wallet: '+79215645656'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19334 (+) With money yamoney_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'yamoney_rub',
            wallet: '+4100100000000'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19335 (+) With money webmoney_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'webmoney_rub',
            wallet: 'R123456789000'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
        expect(data.message).equal(undefined);
    });

    it('C19336 (+) With money payeer_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'payeer_rub',
            wallet: 'P0000000000'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });

    it('C19337 (+) With money advcash_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'advcash_rub',
            wallet: 'mail@example.com'
        });
        // console.log(data);
        expect(data.email).equal('te************l@mailinator.com');
    });
});
