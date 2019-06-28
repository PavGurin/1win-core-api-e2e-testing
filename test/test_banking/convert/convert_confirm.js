import { userList } from '../../../src/methods/userList';
import { checkErrMsg } from '../../../src/responseChecker';

describe('Сonvert confirm', () => {
  it.skip(' (-) Сorrect code', async () => {
    // await userList.login_with_RUB();
    const { data } = await socket.send('BANKING:convert-confirm', { code: 7861017 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });
  it('C19352 (-) Incorrect code', async () => {
    await userList.login_with_RUB();
    const { data } = await socket.send('BANKING:convert-confirm', { code: 7446561 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });
});
