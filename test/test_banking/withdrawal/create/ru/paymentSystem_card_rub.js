import {register} from '../../../../../src/methods/register';
import {userList} from "../../../../../src/methods/userList";
import {checkErrMsg} from "../../../../../src/responseChecker";
import {banking} from "../../../../../src/methods/banking";
import {succses_withdrawal_create} from "../../../../../src/expects/expect_banking";

const currency = 'RUB';
const payment_system = 'card_rub';


describe('Withdrawal create with valid test cases ', () => {

    it('C19325 (+) With money card_rub + valid wallet', async () => {
        await userList.login_with_real_money();
        const {data} = await banking.withdrawal_create(100, '0000111122223333',
            payment_system, currency);
        //console.log(data);
        succses_withdrawal_create(data);
    });
});

describe('Withdrawal create with invalid test cases ', () => {


    it('(-) Without money, wallet = string', async () => {
        await register.one_click_reg();
        const {data} = await banking.withdrawal_create(100, 5446546, payment_system, currency)
        //console.log(data);
        checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
    });

    it('(-) Without money ', async () => {
        await register.one_click_reg();
        const {data} = await banking.withdrawal_create(100, '5446546', payment_system, currency)
        //console.log(data);
        checkErrMsg(data, 400, 'Bad Request.');
    });

    it('C19279 (-) Without money card_rub + valid wallet ', async () => {
        await register.one_click_reg();
        const {data} = await banking.withdrawal_create(100, '0000111122223333', payment_system, currency)
        //console.log(data);
        checkErrMsg(data, 403, 'Недостаточно средств');
    });

    it(' (-) Without money card_rub + amount = string ', async () => {
        await register.one_click_reg();
        const {data} = await banking.withdrawal_create('100', '0000111122223333', payment_system, currency)
        //console.log(data);
        checkErrMsg(data, 403, 'Недостаточно средств');
    });

    it('C19324 (-) With money invalid', async () => {
        await userList.login_with_real_money();
        const {data} = await banking.withdrawal_create(100, '5446546', payment_system, currency)
        //console.log(data);
        checkErrMsg(data, 400, 'Bad Request.');
    });

});

