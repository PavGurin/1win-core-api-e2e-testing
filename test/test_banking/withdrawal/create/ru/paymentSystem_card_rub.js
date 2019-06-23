import {expect} from 'chai';
import {register} from '../../../../../src/methods/register';
import {userList} from "../../../../../src/methods/userList";
import {checkErrMsg} from "../../../../../src/responseChecker";


describe('Withdrawal create with user without money ', () => {


    it('C19278 (-) Without money', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        checkErrMsg(data, 400, 'Bad Request.');
    });

    it('C19279 (-) Without money card_rub + valid wallet ', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        checkErrMsg(data, 403, 'Недостаточно средств');
    });

    it('C19324 (-) With money invalid', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '5446546',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        checkErrMsg(data, 400, 'Bad Request.');
    });

    it('C19325 (+) With money card_rub + valid wallet', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:withdrawal-create', {
            amount: '100',
            wallet: '0000111122223333',
            payment_system: 'card_rub',
            currency: 'RUB'
        });
        //console.log(data);
        expect(data).to.be.an('object');
        expect(data.email).not.equal(null);
        expect(data.message).equal(undefined);
    });
});