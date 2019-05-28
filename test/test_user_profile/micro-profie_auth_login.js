import {expect} from 'chai';

describe('Short schema', () => {

    const promo_code = 'test001';

    it('Login', async () => {

        const {data} = await socket.send('USER:auth-login',
            {
                login: "fcrxntest@xyz.com",
        password: "123456",

    });

        console.log(data);
    });
});