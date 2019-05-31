import {expect} from 'chai';

describe('Auth recovery confirm', () => {

    const new_password = '123456';
    const userId = 1490385;
    const correct_code = 6391721;

    // positive test with 'error' expected
    it('(~) with correct code', async () => {
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

    it('(-)  with incorrect code', async () => {
        const {data} = await socket.send('USER:forgot-confirm', {

                userId: userId,
                code: 1234567,
                password: new_password,
                repeat_password: new_password
            }
        );
        expect(data.status).equal(400);
        expect(data.message).equal('Неверный ключ запроса');
    });
});
