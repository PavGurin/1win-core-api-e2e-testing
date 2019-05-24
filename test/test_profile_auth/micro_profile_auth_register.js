import {expect} from 'chai';

describe('Short schema', () => {

    const promo_code = 'test001';

    it('Short reg + visit_domain + partner_key', async () => {

        const {data} = await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23,
                visit_domain: 'someDomain',
                partner_key: promo_code
            });
        // console.log(data);
        console.log('\nLogin: \'' + data.email + '\', password: \'' + data.password + '\'\n\n');

        expect(data.country)
            .to
            .equal('someCountry');
        expect(data.partner_key)
            .to
            .equal(promo_code);
    });

    it('Short reg + visit domain - partner_key', async () => {

        const {data} = await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23,
                visit_domain: 'someDomain'
            });
        // console.log(data);
        console.log('\nLogin: \'' + data.email + '\', password: \'' + data.password + '\'\n\n');

        expect(data.country)
            .to
            .equal('someCountry');
    });

    it('Short reg - visit_domain + partner_key', async () => {

        const {data} = await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23,
                partner_key: promo_code
            });
        // console.log(data);
        console.log('\nLogin: \'' + data.email + '\', password: \'' + data.password + '\'\n\n');

        expect(data.country)
            .to
            .equal('someCountry');
        expect(data.partner_key)
            .to
            .equal(promo_code);
    });

    it('Short reg - visit_domain - partner_key', async () => {

        const {data} = await socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23
            });
        // console.log(data);
        // console.log('\nLogin: \'' + data.email + '\', password: \'' + data.password + '\'\n\n');

        expect(data.status).to.equal(400)
    });
});