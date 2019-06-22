import {userList} from '../../../src/methods/userList';
import {register} from '../../../src/methods/register';
import {checkErrMsg} from "../../../src/responseChecker";
import {banking} from "../../../src/methods/banking";

describe('Create deposite - RUB validation messages', () => {

    //Завести багу на 500, в ответе должно приходить 400 с текстом ошибки
    it('< max amount & wallet = numbers', async () => {
        const {user} = await register.one_click_reg();
        const {data} = await banking.deposite_create_rub(100, null,
            'card_rub', 'RUB')
        //console.log(data);
        checkErrMsg(400, 'Неверный формат кошелька')
    });

    it('C19383 RUB - paymentType = tele2_rub and wallet = null', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: 100,
            wallet: '',
            paymentType: 'tele2_rub',
            currency: 'RUB'
        });
        //console.log(data);
        checkErrMsg(data, 400, 'Неверный формат кошелька')
    });

    it('C19387 (-) RUB - paymentType = card_rub and amount = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: null,
            wallet: '',
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided')
    });

    it('C19388 (-) RUB - paymentType = card_rub and wallet = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '1',
            wallet: null,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C19389 (-) RUB - paymentType = card_rub and wallet = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '0',
            wallet: null,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) card_rub and amount: empty', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: ' ',
            wallet: null,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) card_rub and wallet = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '15.675656',
            wallet: null,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) paymentType: = empty', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '15.675656',
            wallet: null,
            paymentType: '',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) paymentType: = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '15.675656',
            wallet: 3453453453,
            paymentType: null,
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) currency: = empty', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '15.675656',
            wallet: null,
            paymentType: 'card_rub',
            currency: ''
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) currency: = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '15.675656',
            wallet: null,
            paymentType: 'card_rub',
            currency: null
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Bad request, amount is invalid')
    });

    it('C19389 (-) currency: = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '9.0123',
            wallet: 5464564564,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C19389 (-) currency: = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '9',
            wallet: 5464564564,
            paymentType: 'card_rub',
            currency: 'RUB'
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

    it('C19389 (-) currency: = null', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:deposit-create', {

            amount: '100001',
            wallet: '',
            paymentType: 'card_rub',
        });
        // console.log(data);
        checkErrMsg(data, 400, 'Неверная сумма')
    });

});
