import {expect} from 'chai';
import {register} from '../../src/methods/register';
import {update_profile} from '../../src/methods/ms_user';
import {randomStr} from '../../src/randomizer';

describe('Profile update after oneClick registration', () => {

    /* Hint from documentation
     {
     name: String, // (3-16 symbols)
     email: String,
     phone: String, // (5-30 symbols)
     password: String, // (6-18 symbols)
     new_password: ?String, // (6-18 symbols)
     repeat_password: ?String, // (equals to new password)
     birthday: Number
     }
     */

    it('C19323 (+) change name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newName = randomStr();

        const {data: {updatedUser}} = await update_profile({
            password: password,
            name: newName
        });
        // console.log(updatedUser);
        expect(updatedUser.name).to.equal(newName);
    });

    it('C19323 (+) change eMail', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newEmail = randomStr() + '@new.ru';

        const {data: {updatedUser}} = await update_profile({
            password: password,
            email: newEmail
        });
        // console.log(updatedUser);
        expect(updatedUser.email).to.equal(newEmail);
    });

    it('C19323 (-) change eMail twice', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const firstEmailChange = randomStr() + '@first.change';

        const {data: {updatedUser}} = await update_profile({
            password: password,
            email: firstEmailChange
        });
        console.log(updatedUser.email);
        expect(updatedUser.email).to.equal(firstEmailChange);

        const secondEmailChange = randomStr() + '@second.change';
        const {data: {updatedUser: updatedUser2}} = await update_profile({
            password: password,
            email: secondEmailChange
        });
        console.log(updatedUser2.email);
        expect(updatedUser2.email).to.equal(firstEmailChange);
    });

    it('C19323 (-) change country', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: {updatedUser}} = await update_profile({
            password: password,
            country: 'countryWasChanged'
        });
        // console.log(updatedUser);
        expect(updatedUser.country).to.equal(default_country);
    });
});

// const logout = () => socket.send('USER:auth-logout', {});
//
// async function checkPasswordChange(login) {
//
//     const {data} = await socket.send('USER:auth-login', {
//         login: login,
//         password: default_password
//     });
//     return data;
// }
