import {expect} from 'chai';
import {randomNum, randomStr} from '../../src/randomizer';

describe('Profile update', () => {

    const promo_code = 'test001';
    const birthday = 946587600002;
    const default_password = '123456';

    // const logout = () => socket.send('USER:auth-logout', {});
    //     //
    //     // async function checkPasswordChange(login) {
    //     //
    //     //     const {data} = await socket.send('USER:auth-login', {
    //     //         login: login,
    //     //         password: default_password
    //     //     });
    //     //     return data;
    //     // }

    it('Short reg and updating user', async () => {

        let {data} = await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23,
                visit_domain: 'someDomain',
                partner_key: promo_code
            });

        const userId = data.user_id;
        const password = data.password;

        console.log('Before update: \nUserId = ' + data.user_id + ', eMail = ' + data.email +
            ', phone = ' + data.phone);

        const {data: {updatedUser}} = await socket.send('USER:profile-update',
            {
                userId: userId,
                name: randomStr(),
                country: 'Russia',
                timezone: 1,
                email: randomStr(5) + '_upd@test.xyz',
                phone: randomNum().toString(),
                password: password,
                new_password: '123456',
                repeat_password: '123456',
                birthday: birthday
            });
        console.log('After update: \nUserId = ' + updatedUser.id + ', eMail = ' + updatedUser.email +
            ', phone = ' + updatedUser.phone);

        expect(data.id).equal(updatedUser.id);
        expect(updatedUser.name).to.have.lengthOf(6).and.not.equal(data.name);
        expect(updatedUser.country).equal('Russia').and.not.equal(data.country);
        expect(updatedUser.email).satisfies(email => email.endsWith('_upd@test.xyz'))
                                 .and.not.equal(data.email);
        expect(updatedUser.phone).to.have.lengthOf(7).and.not.equal(data.phone);
        expect(updatedUser.birthday).equal(birthday).and.not.equal(data.birthday);

        // const y = await logout();
        // const x = await checkPasswordChange(updatedUser.email);
        // console.log(x);
    });
});
