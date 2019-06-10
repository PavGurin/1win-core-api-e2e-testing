import {expect} from 'chai';
import {randomStr, randomNum} from '../../src/randomizer';
import {checkErrorMsg} from '../../src/responseChecker';

describe('Register with partner key', () => {

    beforeEach(() => {
        console.log('\nhello i\'m a new run');
    });

    // TODO test to check request send subs_id

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

    const visit_domain = 'some_domain';
    const promo_code = 'test001';
    const default_password = '123456';

    // (+) for positive tests (-) for negative tests
    it('test', async () => {

        const testStr = randomStr();
        const testNum = randomNum();

        const {data} = await defaultRequest({
            name: testStr,
            sub_ids: 'sub1=sub_1&sub2=sub_2&sub3=sub_3',
            email: testStr + '_test@xyz.com',
            phone: '921' + testNum,
            password: default_password,
            repeat_password: default_password,
            visit_domain: visit_domain,
            partner_key: promo_code
        });
        console.log(data);
        checkRegInfo(data, testStr, testNum);
    });

});
