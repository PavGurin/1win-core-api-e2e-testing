import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Withdrawal confirm', () => {

    // TODO необходимо продумать тест с созданием перевода и подставлять в этот тест всегда актуальный код
    it('C19338 (-) Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-confirm', {code: 1070416});
        console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Неверный ключ запроса');
    });

    it.skip('C19339 (-) Nonexistent code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:withdrawal-confirm', {code: 9999999});
        console.log(data);
        expect(data.status).equal(403);
        expect(data.message).equal('Выплата не найдена');
    });
});
