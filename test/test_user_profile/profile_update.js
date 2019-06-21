import {expect} from 'chai';
import {register} from '../../src/methods/register';
import {update_profile} from '../../src/methods/ms_user';
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

    it('C21394 (-) change to short name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newName = randomStr(2);

        const {data: updatedUser} = await update_profile({
            password: password,
            name: newName
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, name is invalid');
    });

    it('C21395 (-) change to long name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newName = randomStr(17);

        const {data: updatedUser} = await update_profile({
            password: password,
            name: newName
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, name is invalid');
    });

    it('C21396 (+) change eMail', async () => {

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

    it('C21397 (-) change eMail twice', async () => {

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

    it('C21398 (-) change country', async () => {

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

    it('C21399 (+) change phone', async () => {

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

    it('C21400 (-) change to short phone', async () => {

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

    it('C21401 (-) change to long phone', async () => {

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

    it('C21402 (-) change phone to existing one', async () => {

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

    it('C21403 (+) change password', async () => {

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

    it('C21404 (-) change to different passwords', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            new_password: randomStr(),
            repeat_password: randomStr()
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Password confirmation not matches to a new password');
    });

    it('C21417 (-) change w/o \'repeat password\' value', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPassword = randomStr();

        const {data: {updatedUser: updatedUser}} = await update_profile({
            password: password,
            new_password: newPassword
            // repeat_password: newPassword
        });
        // console.log(updatedUser);

        await socket.send('USER:auth-logout', {});

        const {data: loginResult} = await socket.send('USER:auth-login', {
            login: updatedUser.email,
            password: password
        });
        // console.log(loginResult);
        checkErrorMsg(loginResult, 'Неверный email или пароль');
    });

    it('C21418 (-) change w/o \'new password\' value', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newPassword = randomStr();

        const {data: {updatedUser: updatedUser}} = await update_profile({
            password: password,
            // new_password: newPassword
            repeat_password: newPassword
        });
        // console.log(updatedUser);

        await socket.send('USER:auth-logout', {});

        const {data: loginResult} = await socket.send('USER:auth-login', {
            login: updatedUser.email,
            password: newPassword
        });
        // console.log(updatedUser);
        checkErrorMsg(loginResult, 'Неверный email или пароль');
    });

    it('C21405 (-) null name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            name: null
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, name is required, no default value provided');
    });

    it('C21406 (-) empty name', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            name: ''
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, name is invalid');
    });

    it('C21407 (-) null email', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            email: null
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, email is required, no default value provided');
    });

    it('C21408 (-) empty email', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            email: ''
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, email is invalid');
    });

    it('C21409 (-) null phone', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            phone: null
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, phone is required, no default value provided');
    });

    it('C21410 (-) empty phone', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            phone: ''
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
    });

    it('C21411 (-) null password', async () => {

        await register.one_click_reg();

        const {data: updatedUser} = await update_profile({
            password: null
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, password is required, no default value provided');
    });

    it('C21412 (-) empty password', async () => {

        await register.one_click_reg();

        const {data: updatedUser} = await update_profile({
            password: ''
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Неверный пароль');
    });

    it('C21413 (-) invalid eMail', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newEmail = 'that\'s invalid email';

        const {data: updatedUser} = await update_profile({
            password: password,
            email: newEmail
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, email is invalid');
    });

    it('C21414 (+) change every field', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newName = randomStr();
        const newPhone = randomNum().toString();
        const newBirthDay = randomNum();

        const {data: {updatedUser}} = await update_profile({
            password: password,
            name: newName,
            phone: newPhone,
            email: newName + '@new.xyz',
            birthday: newBirthDay
        });
        // console.log(updatedUser);
        expect(updatedUser.id).to.equal(data.id);
        expect(updatedUser.name).to.equal(newName);
        expect(updatedUser.phone).to.equal(newPhone);
        expect(updatedUser.email).to.equal(newName + '@new.xyz');
        expect(updatedUser.birthday).to.equal(newBirthDay);
    });

    it('C21415 (-) change email after usual reg', async () => {
        const {data} = await register.usual_reg();
        // console.log(data);
        const password = data.password;
        console.log(data.name);
        const {data: {updatedUser: updatedUser}} = await update_profile({
            password: password,
            email: randomStr() + '@new.ru'
        });
        // console.log(updatedUser);
        expect(data.email).to.equal(updatedUser.email);
    });

    it('C21416 (+) change birthday', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;
        const newBirthday = randomNum();

        const {data: {updatedUser}} = await update_profile({
            password: password,
            birthday: newBirthday
        });
        // console.log(updatedUser);
        expect(data.birthday).to.not.equal(updatedUser.birthday);
        expect(updatedUser.birthday).to.equal(newBirthday);
    });

    it('C21419 (-) null birthday', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            birthday: null
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, birthday is required');
    });

    it('C21420 (-) empty birth1day', async () => {

        const {data} = await register.one_click_reg();
        // console.log(data);
        const password = data.password;

        const {data: updatedUser} = await update_profile({
            password: password,
            birthday: ''
        });
        // console.log(updatedUser);
        checkErrorMsg(updatedUser, 'Bad request, birthday should have a type of number, but found string');
    });
});
