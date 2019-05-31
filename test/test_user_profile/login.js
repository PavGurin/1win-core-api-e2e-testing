import {expect} from 'chai';
import {randomStr} from '../../src/randomizer';

describe('Login', () => {

    const default_user = 'fcrxntest@xyz.com';
    const default_phone = '9213320385';
    const default_password = '123456';
    const default_id = 290;

    function checkSuccessMsg(data) {
        expect(data.email).equal(default_user);
        expect(data.phone).equal(default_phone);
        expect(data.id).equal(default_id);
        expect(data.user_id).equal(default_id);
    }

    function checkErrorMsg(data, expectedMessage) {
        expect(data.status).to.equal(400);
        expect(data.message).to.equal(expectedMessage);
    }

    // (+) for positive tests (-) for negative tests
    it('(+) login by email', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password
        });
        console.log(data);
        checkSuccessMsg(data);
    });

    it('(+) login by phone', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_phone,
            password: default_password
        });
        console.log(data);
        checkSuccessMsg(data);
    });

    it('(-) nonexistent user', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: 'nonexistent_user@yep.fail',
            password: default_password
        });
        console.log(data);
        checkErrorMsg(data, 'Пользователь  не найден');
    });

    it('(-) wrong password', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: default_password + 'x'
        });
        console.log(data);
        checkErrorMsg(data, 'Неверный пароль');
    });

    //TODO ожидает фикса
    it.skip('(-) empty login', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: '',
            password: default_password
        });
        console.log(data);
        checkErrorMsg(data, 'Пользователь  не найден');
    });

    it('(-) empty password', async () => {

        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: ''
        });
        console.log(data);
        checkErrorMsg(data, 'Неверный пароль');
    });

    it('(-) long login (17 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: randomStr(17),
            password: ''
        });
        console.log(data);
        checkErrorMsg(data, 'Пользователь  не найден');
    });

    it('(-) long password (19 symbols)', async () => {
        const {data} = await socket.send('USER:auth-login', {
            login: default_user,
            password: randomStr(19)
        });
        console.log(data);
        checkErrorMsg(data, 'Неверный пароль');
    });
});
