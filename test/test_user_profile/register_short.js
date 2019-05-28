import {expect} from 'chai';

describe('Register - Short schema', () => {
    const defaultRequest = (params) => socket.send('USER:auth-register',
        {
            isShort: true,
            country: 'someCountry',
            timezone: 23,
            ...params
        });

    const promo_code = 'test001';

    // проверка ответа успешной регистрации
    function checkRegInfo(data) {
        // длина email при регистрации в 1 клик = 15 символам
        expect(data.email)
            .to.have.lengthOf(15);
        // длина пароля при регистрации в 1 клик = 6 символам
        expect(data.password)
            .to.have.lengthOf(6);
        expect(data.country)
            .to.equal('someCountry');
    }

    // register via short scheme with 'visit_domain' and 'partner_key'
    it('+ visit_domain + partner_key', async () => {

        const {data} = await defaultRequest({
            visit_domain: 'someDomain',
            partner_key: promo_code
        });

        checkRegInfo(data);
    });

    it('+ visit domain - partner_key', async () => {

        const {data} = await defaultRequest({
            visit_domain: 'someDomain'
        });

        checkRegInfo(data);
    });

    it('- visit_domain + partner_key', async () => {

        const {data} = await defaultRequest({
            partner_key: promo_code
        });

        checkRegInfo(data);
        expect(data.partner_key)
            .to.equal(promo_code);
    });

    it('- visit_domain - partner_key', async () => {
        // request without mandatory params
        const {data} = await defaultRequest();

        expect(data.status)
            .to.equal(400);
    });
});