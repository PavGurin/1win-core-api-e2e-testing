import {expect} from 'chai';
import {randomStr} from '../../src/randomizer';
import {checkErrorMsg} from '../../src/responseChecker';
import {userList} from '../../src/userList';

describe('Login', () => {

    const default_user = '123123@mailinator.com';
    const default_phone = '+79511511515';
    const default_password = '123123';
    const default_id = 1322492;

    function checkSuccessMsg(data) {
        expect(data.email).equal(default_user);
        expect(data.phone).contains(default_phone);
        expect(data.id).equal(default_id);
        expect(data.user_id).equal(default_id);
    }

    // (+) for positive tests (-) for negative tests
    it('C19293 (+) login by email', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: '123123@mailinator.com',
            password: '123123',
            tg_hash: randomStr(5)
        });
        // const data = await userList.login_without_money();
        console.log(data);
        checkSuccessMsg(data);
    });

    it('C19294 (+) login by phone', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: '+79511511515',
            password: '123123',
            tg_hash: randomStr(5)
        });
        console.log(data);
        checkSuccessMsg(data);
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

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password + 'x',
            tg_hash: randomStr(5)
        });
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

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: '',
            tg_hash: randomStr(5)
        });
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
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: randomStr(19),
            tg_hash: randomStr(5)
        });
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });

    it('C19926 (+) short tg_hash (4 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password,
            tg_hash: randomStr(4)
        });
        // console.log(data);
        checkSuccessMsg(data);
    });

    it('C19927 (+) long tg_hash (6 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password,
            tg_hash: randomStr(6)
        });
        // console.log(data);
        checkSuccessMsg(data);
    });

    it('C19928 (+) empty tg_hash', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password,
            tg_hash: null
        });
        // console.log(data);
        checkSuccessMsg(data);
    });

    it('C19929 (+) w/o tg_hash', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password
        });
        // console.log(data);
        checkSuccessMsg(data);
    });
});
