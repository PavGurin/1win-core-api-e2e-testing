import {expect} from 'chai';
import {checkErrorMsg} from '../../src/responseChecker';
import {register} from '../../src/methods/register';

describe('Auth recovery confirm', () => {

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

    // register > ask for recovery > try to confirm > check
    it('C19317 (-) with incorrect code', async () => {
        const {data: regData} = await register.one_click_reg();
        // console.log(regData);

        await socket.send('USER:forgot-recovery', {
            account: regData.email
        });

        const {data: confirmReq} = await socket.send('USER:forgot-confirm', {
            userId: regData.id,
            code: 1234567,
            password: default_password,
            repeat_password: default_password
        });
        // console.log(confirmReq);
        checkErrorMsg(confirmReq, 'Неверный ключ запроса');
    });
});
