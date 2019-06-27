import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {register} from '../../src/methods/register';

describe('Balance get', () => {
    it('C19353 (+) Without money', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data['0'].balance).equal(0);
        expect(data['0'].currency).equal('RUB');
        expect(data['1'].balance).equal(0);
        expect(data['1'].currency).equal('USD');
        expect(data['2'].balance).equal(0);
        expect(data['2'].currency).equal('EUR');
    });

    it('C19354 (+) With money rub ', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data['0'].balance).not.equal(0);
        expect(data['0'].currency).equal('RUB');
        expect(data['1'].balance).equal(0);
        expect(data['1'].currency).equal('USD');
        expect(data['2'].balance).equal(0);
        expect(data['2'].currency).equal('EUR');
    });

    it('C21429 (+) Balance USD, RUB, EUR > 0', async () => {
        await userList.login_with_real_money();
        const {data} = await socket.send('BANKING:balance-get');
        console.log(data);
        expect(data['0'].balance).not.equal(0);
        expect(data['0'].currency).equal('RUB');
        expect(data['1'].balance).not.equal(0);
        expect(data['1'].currency).equal('USD');
        expect(data['2'].balance).not.equal(0);
        expect(data['2'].currency).equal('EUR');
    });
});