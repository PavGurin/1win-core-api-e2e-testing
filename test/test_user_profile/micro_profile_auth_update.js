import {expect} from 'chai';

describe('Short schema', () => {

    const promo_code = 'test001';

    it('Short reg and updating user', async () => {

        const {data} = await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23,
                visit_domain: 'someDomain',
                partner_key: 'test001'
            });
        console.log(data);

        const userId = data.id.toString();
        const password = data.password;

        const email = data.email;
        const phone = data.phone;

        // console.log(authRegister);
        //
        const {data2} = await socket.send('USER:profile-update',
            {
                name: '277',
                country: 'Russia',
                timezone: 1,
                email: email,
                phone: phone,
                password: password,
                new_password: '123456',
                repeat_password: '123456',
                birthday: 946587600002
            });

        console.log(userId);
        console.log(password);
        console.log(data2);
    });
});