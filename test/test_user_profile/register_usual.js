import {expect} from 'chai';

describe('Usual schema', () => {

    const defaultRequest = (params) => socket.send('USER:auth-register',
        {
            isShort: false,
            country: 'someCountry',
            timezone: 23,
            birthday: 946587600000,
            ...params
        });

    // проверка ответа успешной регистрации
    function checkRegInfo(data, testText, testNumber) {
        expect(data.email)
            .to.equal(testText + '_test@xyz.com');
        expect(data.password)
            .to.equal(default_password);
        expect(data.phone)
            .to.equal('921' + testNumber);
        expect(data.name)
            .to.equal(testText);
        expect(data.country)
            .to.equal('someCountry');
    }

    function checkErrorMsg(errorMessage, expectedMessage) {
        expect(errorMessage).to.equal(expectedMessage);
    }

    const visit_domain = 'some_domain';
    const promo_code = 'test001';
    const default_password = '123456';

    // returns random String with length parameter
    function randomStr(length = 6) {
        if (length > 10) {
            let finalStr = '';
            for (let i = 0; i < ((length - length % 10) / 10); i++) {
                finalStr += Math.random().toString(36).slice(-10);
            }
            if (length % 10 === 0) {
                return finalStr;
            } else
                return finalStr + Math.random().toString(36).slice(-(length % 10));
        } else
            return Math.random().toString(36).slice(-length);
    }

    function randomNum() { // returns 7 numbers *** ** **
        return Math.floor(Math.random() * 9999999) + 1;
    }

    // (+) for positive tests (-) for negative tests
    it('(+) + visit_domain', async () => {

        const testStr = randomStr();
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain
        });
        // console.log(data);
        checkRegInfo(data, testStr, testNum);
    });

    it('(+) + promo_code', async () => {

        const testStr = randomStr();
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: default_password,
            repeat_password: default_password,
            partner_key: promo_code
        });
        // console.log(data);
        checkRegInfo(data, testStr, testNum);
    });

    it('(+) + visit_domain + partner_key', async () => {

        const testStr = randomStr();
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain,
            partner_key: promo_code
        });
        // console.log(data);
        checkRegInfo(data, testStr, testNum);
    });

    it('(-) short name', async () => {

        const testStr = randomStr(2);
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain,
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Name is invalid, it\'s length must be from 3 to 16 symbols');
    });

    it('(-) long name', async () => {

        const testStr = randomStr(17);
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain,
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Name is invalid, it\'s length must be from 3 to 16 symbols');
    });

    it('(-) short phone number', async () => {

        const testStr = randomStr();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: randomStr(4),
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain,
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
    });

    it('(-) long phone number', async () => {

        const testStr = randomStr();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: randomStr(31),
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain,
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
    });

    it('(-) different passwords', async () => {

        const testStr = randomStr();
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: testStr,
            repeat_password: testStr + '1',
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Password confirmation not matches to password');
    });

    it('(-) short password', async () => {

        const testStr = randomStr(5);
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: testStr,
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: testStr,
            repeat_password: testStr,
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Password is invalid, it\'s length must be from 6 to 18 symbols');
    });

    it('(-) long password', async () => {

        const testStr = randomStr(19);
        const testNum = randomNum();

        const {data} = await defaultRequest({
            isShort: false,
            name: randomStr(),
            email: randomStr() + '_test@xyz.com',
            phone: '921' + testNum,
            password: testStr,
            repeat_password: testStr,
            partner_key: promo_code
        });
        // console.log(data);
        checkErrorMsg(data.message, 'Password is invalid, it\'s length must be from 6 to 18 symbols');
    });

    it('(-) - visit_domain - partner_key', async () => {

        const {data} = await defaultRequest({
            isShort: false,
            name: randomStr(),
            email: randomStr() + 'test@xyz.com',
            phone: '921' + randomNum,
            password: default_password,
            repeat_password: default_password
        });
        // console.log(data);
        expect(data.status).to.equal(400);
        checkErrorMsg(data.message, 'Visit domain is required if partner key does not specified');
    });
});
