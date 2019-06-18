import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {register} from "../../src/methods/register";

//returns withdrawals sorted by time
describe('Withdrawal history', () => {

    it('C19359 - (+) without withdrawal', async () => {
        await register.one_click_reg();
        const {data} = await socket.send('BANKING:withdrawal-history');
        // console.log(data);
        expect(data.length).equal(0);
    });

    it('C19360 -(+) with withdrawal @dev', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-history');
        // console.log(data);
        expect(data["0"].id).equal(163);
        expect(data["0"].time).equal(1559039814000);
        expect(data["0"].payment_system).equal('money-transfer');
        expect(data["0"].amount).equal(100);
        expect(data["0"].status).equal(1);
    });
});
