import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';

describe('Withdrawal confirm', () => {
  // TODO необходимо продумать тест с созданием перевода и подставлять
  //  в этот тест всегда актуальный код
  it('C19338 (-) Incorrect code code response 403', async () => {
    await register.one_click_reg();
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 10704 });
    // console.log(data);
    checkErrMsg(data, 403, 'Выплата не найдена');
  });

  it('C19339 (-) Incorrect code response 400', async () => {
    await userList.login_with_real_money();
    await banking.withdrawal_create(100, 1111222200003333,
      'card_rub', 'RUB');
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 99 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });
});
