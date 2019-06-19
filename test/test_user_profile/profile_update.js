import {expect} from 'chai';
import {register} from '../../src/register';
import {update_profile} from '../../src/ms_user';
import {randomNum, randomStr} from '../../src/randomizer';
import {checkErrorMsg} from '../../src/responseChecker';

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

    //todo phone change, pwd change, birthday change
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
        expect(updatedUser.id).to.equal(data.id);
        expect(updatedUser.name).to.equal(newName);
    });

    it('C19323 (-) change to short name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newName = randomStr(2);

        const {data: {updatedUser}} = await update_profile({
            password: password,
            name: newName
        });
        // console.log(updatedUser);
        expect(data.name).to.equal(updatedUser.name);
        checkErrorMsg(updatedUser, 'error');
    });

    it('C19323 (-) change to long name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newName = randomStr(17);

        const {data: {updatedUser}} = await update_profile({
            password: password,
            name: newName
        });
        // console.log(updatedUser);
        expect(data.name).to.equal(updatedUser.name);
        checkErrorMsg(updatedUser, 'error');
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
        expect(updatedUser.id).to.equal(data.id);
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
        // console.log(updatedUser.email);
        expect(updatedUser.email).to.equal(firstEmailChange);

        const secondEmailChange = randomStr() + '@second.change';
        const {data: {updatedUser: updatedUser2}} = await update_profile({
            password: password,
            email: secondEmailChange
        });
        // console.log(updatedUser2.email);
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
        expect(updatedUser.id).to.equal(data.id);
        expect(updatedUser.country).to.equal(default_country);
    });

    it('C19323 (+) change phone', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPhone = randomNum().toString();

        const {data: {updatedUser}} = await update_profile({
            password: password,
            phone: newPhone
        });
        // console.log(updatedUser);
        expect(updatedUser.id).to.equal(data.id);
        expect(updatedUser.phone).to.equal(newPhone);
    });

    it('C19323 (-) change to short phone', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPhone = randomStr(4);

        const {data: updatedUser} = await update_profile({
            password: password,
            phone: newPhone
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
    });

    it('C19323 (-) change to long phone', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPhone = randomStr(31);

        const {data: updatedUser} = await update_profile({
            password: password,
            phone: newPhone
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
    });

    it('C19323 (-) change phone to existing one', async () => {
        //TODO maybe logout needed
        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPhone = randomNum().toString();

        const {data: {updatedUser}} = await update_profile({
            password: password,
            phone: newPhone
        });
        // console.log(updatedUser);
        expect(updatedUser.phone).to.equal(newPhone);

        await socket.send('USER:auth-logout', {});

        const {data: data2} = await register.one_click_reg();
        // console.log(data2);
        const password2 = data2.password;

        const {data: updatedUser2} = await update_profile({
            password: password2,
            phone: newPhone
        });
        // console.log(updatedUser2);
        expect(updatedUser.id).to.equal(data.id);
        checkErrorMsg(updatedUser2, 'Пользователь с таким номером телефона уже существует');
    });

    it('C19323 (+) change password', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPassword = randomStr();

        const {data: {updatedUser}} = await update_profile({
            password: password,
            new_password: newPassword,
            repeat_password: newPassword
        });
        // console.log(updatedUser);
        await socket.send('USER:auth-logout', {});

        const {data: loginResult} = await socket.send('USER:auth-login', {
            login: updatedUser.email,
            password: newPassword
        });
        // console.log(loginResult);
        expect(loginResult.email).to.equal(updatedUser.email);
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
