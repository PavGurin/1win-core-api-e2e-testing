import {expect} from 'chai';
import {randomStr} from '../../src/randomizer';
import {checkErrorMsg} from '../../src/responseChecker';

describe('Login', () => {

    const default_user = 'fcrxntest@xyz.com';
    const default_phone = '+79213320385';
    const default_password = '123456';
    const default_id = 1490253;

    function checkSuccessMsg(data) {
        expect(data.email).equal(default_user);
        expect(data.phone).equal(default_phone);
        expect(data.id).equal(default_id);
        expect(data.user_id).equal(default_id);
    }

    // (+) for positive tests (-) for negative tests
    it('C19293 (+) login by email', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password
        });
        // console.log(data);
        checkSuccessMsg(data);
    });

    it('C19294 (+) login by phone', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_phone,
            password: default_password
        });
        // console.log(data);
        checkSuccessMsg(data);
    });

    it('C19295 (-) nonexistent user', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: 'nonexistent_user@yep.fail',
            password: default_password
        });
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });

    it('C19296 (-) wrong password', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password + 'x'
        });
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });

    it('C19297 (-) empty login', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: '',
            password: default_password
        });
        // console.log(data);
        checkErrorMsg(data, 'Bad request, login is invalid');
    });

    it('C19298 (-) empty password', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: ''
        });
        // console.log(data);
        checkErrorMsg(data, 'Bad request, password is invalid');
    });

    it('C19299 (-) long login (17 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: randomStr(17),
            password: ''
        });
        // console.log(data);
        checkErrorMsg(data, 'Bad request, password is invalid');
    });

    it('C19300 (-) long password (19 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: randomStr(19)
        });
        // console.log(data);
        checkErrorMsg(data, 'Неверный email или пароль');
    });
});
