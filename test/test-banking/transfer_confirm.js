import {expect} from 'chai';
import {userList} from '../../src/userList';
import {checkErrorMsg} from '../../src/responseChecker';

describe.skip('Transfer confirm', () => {

    //TODO продумать логику теста так, чтобы нужный код подставлялся сам в момент запуска теста
    it('C19365 (-) Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-confirm', {code: 5372831});
        // console.log(data);
        checkErrorMsg(data, 'Неверный ключ запроса');
    });

    it.skip('C19366 (-) Nonexistent code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:transfer-confirm', {code: 111});
        // console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Перевод не найден');
    });
});
