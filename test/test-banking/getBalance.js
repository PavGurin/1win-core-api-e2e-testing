import {expect} from 'chai';
import {userList} from '../../src/userList';
import {register} from "../../src/register";

describe('Balance get', () => {

    it('C19353 (+) Without money', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(0);
    });

    it('C19354 (+) With money rub + usd @dev', async () => {
        await userList.login_with_RUB_USD();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(5000);
    });

});
