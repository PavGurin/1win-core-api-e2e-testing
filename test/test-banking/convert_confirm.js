import {userList} from '../../src/methods/userList';
import {checkErrorMsg} from '../../src/responseChecker';

describe('Сonvert confirm', () => {

    it('C19352 (-) Incorrect code', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BANKING:convert-confirm', {code: 7446561});
        // console.log(data);
        checkErrorMsg(data, 'Неверный ключ запроса');
    });
});
