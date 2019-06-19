import {expect} from 'chai';
import {checkErrorMsg} from '../../src/responseChecker';

describe('Auth recovery confirm', () => {

    const new_password = '123456';
    const userId = 1491435; // prod 1490385
    const correct_code = 6391721;

    //TODO need to get correct_code from mail
    it.skip('C19316 (+) with correct code', async () => {
        const {data} = await socket.send('USER:forgot-confirm', {

                userId: userId,
                code: correct_code,
                password: new_password,
                repeat_password: new_password
            }
        );
        // { error : false } - real expected response
        expect(data.error).to.equal(false);
    });

    //TODO request to recovery > confirm request
    it('C19317 (-) with incorrect code', async () => {
        const {data} = await socket.send('USER:forgot-confirm', {

            userId: userId,
            code: 1234567,
            password: new_password,
            repeat_password: new_password
        });
        checkErrorMsg(data, 'Неверный ключ запроса');
    });
});
