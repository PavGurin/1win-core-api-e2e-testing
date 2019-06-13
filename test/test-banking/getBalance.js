import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Balance get', () => {

    it('C19353 (+) Without money', async () => {
        const defaultRequest = (params) => socket.send('USER:auth-register',
            {
                isShort: true,
                country: 'someCountry',
                timezone: 23,
                ...params
            });
        await defaultRequest({
            visit_domain: 'someDomain'
        });

        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(0);
    });

    it('C19354 (+) With money rub + usd', async () => {
        await userList.login_with_RUB_USD();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(5000);
    });

});
