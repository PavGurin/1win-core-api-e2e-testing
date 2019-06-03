import {expect} from 'chai';
import {userList} from '../../src/userList';

describe.skip('Balance get', () => {

    it('C19353 (+) Without money', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(0);
    });

    //TODO продумать как проверять баланс, который явл динамическим значением
    //Например тест который получает текущий баланс > делает ставку и вычисляет текущий баланс
    it.skip('(+) With money only rub', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(4697);
    });

    it('C19354 (+) With money rub + usd', async () => {
        await userList.login_with_RUB_USD();
        const {data} = await socket.send('BANKING:balance-get');
        // console.log(data);
        expect(data.balance).equal(5000);
    });
});
