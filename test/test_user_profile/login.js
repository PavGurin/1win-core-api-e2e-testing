import {expect} from 'chai';
import {randomStr} from '../../src/randomizer';
import {checkErrorMsg} from '../../src/responseChecker';
import {userList} from '../../src/methods/userList';
import {register} from '../../src/methods/register';

describe('Login', () => {

    // (+) for positive tests (-) for negative tests
    it('C19293 (+) login by email', async () => {
        const {data} = await register.one_click_reg();
        const {status} = await userList.login_with_params(data.email, data.password);
        // console.log(status);
        expect(status).equal(200);
    });

    it('C19294 (+) login by phone', async () => {
        const {data} = await register.one_click_reg();
        const {status} = await userList.login_with_params(data.phone, data.password);
        // console.log(status);
        expect(status).equal(200);
    });

    it('C19295 (-) nonexistent user', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: 'nonexistent_user@yep.fail',
            password: default_password,
            tg_hash: randomStr(5)
        });
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });

    it('C19296 (-) wrong password', async () => {

        const {data: regResult} = await register.one_click_reg();
        const {data} = await userList.login_with_params(regResult.email, 'wrongPass');
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });

    it('C19297 (-) empty login', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: '',
            password: default_password,
            tg_hash: randomStr(5)
        });
        // console.log(data);
        checkErrorMsg(data, 'Bad request, login is invalid');
    });

    it('C19298 (-) empty password', async () => {

        const {data: regResult} = await register.one_click_reg();
        const {data} = await userList.login_with_params(regResult.email, '');
        // console.log(data);
        checkErrorMsg(data, 'Bad request, password is invalid');
    });

    it('C19299 (-) long login (17 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: randomStr(17),
            password: '',
            tg_hash: randomStr(5)
        });
        // console.log(data);
        checkErrorMsg(data, 'Bad request, password is invalid');
    });

    it('C19300 (-) long password (19 symbols)', async () => {
        const {data: regResult} = await register.one_click_reg();
        const {data} = await userList.login_with_params(regResult.email, randomStr(19));
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });

    it('C19926 (+) short tg_hash (4 symbols)', async () => {
        const {data: regResult} = await register.one_click_reg();
        const {status} = await userList.login_with_params(regResult.email, randomStr(19), randomStr(4));
        // console.log(data);
        expect(status).equal(200);
    });

    it('C19927 (+) long tg_hash (6 symbols)', async () => {
        const {data: regResult} = await register.one_click_reg();
        const {status} = await userList.login_with_params(regResult.email, randomStr(19), randomStr(6));
        // console.log(data);
        // console.log(data);
        expect(status).equal(200);
    });

    it('C19928 (+) empty tg_hash', async () => {
        const {data: regResult} = await register.one_click_reg();
        const {status} = await userList.login_with_params(regResult.email, randomStr(19), null);
        // console.log(data);
        // console.log(data);
        expect(status).equal(200);
    });

    it('C19929 (+) w/o tg_hash', async () => {
        const {data: regResult} = await register.one_click_reg();
        const {status} = await userList.login_with_params(regResult.email, randomStr(19));
        // console.log(data);
        // console.log(data);
        expect(status).equal(200);
    });
});
