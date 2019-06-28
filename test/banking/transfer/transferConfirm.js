import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';


describe('Transfer confirm invalid', () => {
  // TODO продумать логику теста так, чтобы нужный код подставлялся сам в момент запуска теста
  it('C19365 (-) Incorrect code with 404 code response', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 5372831 });
    // console.log(data);
    checkErrMsg(data, 404, 'Перевод не найден');
  });
});

describe('Transfer confirm with money', () => {
  it('C19366 (-) Incorrect code with 400 code response', async () => {
    await userList.loginWithRealMoney();
    await banking.transferCreate(100, 'RUB');
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 111 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });
});
