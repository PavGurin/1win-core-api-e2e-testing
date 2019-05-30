import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Withdrawal create with user without money ', () => {

    it.skip('(-) Without money', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(-) Without money card_rub + valid wallet ', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.status).equal(403);
        expect(data.message).equal('Недостаточно средств');
    });

    it.skip('(-) With money invalid', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money card_rub + valid wallet', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money card_uah + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_uah',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money card_uah + valid wallet + USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_uah',
            currency: 'USD'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money beeline_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'beeline_rub',
            wallet: '+79215645654',
            currency: 'RUB'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money beeline_rub + valid wallet + USD', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'beeline_rub',
            wallet: '+79215645656',
            currency: 'USD'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money megafon_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'megafon_rub',
            wallet: '+79215645656'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money mts_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'mts_rub',
            wallet: '+79215645656'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money qiwi_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'qiwi_rub',
            wallet: '+79215645656'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money tele2_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'tele2_rub',
            wallet: '+79215645656'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money yamoney_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'yamoney_rub',
            wallet: '+4100100000000'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money webmoney_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'webmoney_rub',
            wallet: 'R123456789000'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money payeer_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'payeer_rub',
            wallet: 'P0000000000'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

    it('(+) With money advcash_rub + valid wallet + RUB', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            payment_system: 'advcash_rub',
            wallet: 'mail@example.com'
        });
        console.log(data);
        expect(data.message).equal(undefined);
    });

});
