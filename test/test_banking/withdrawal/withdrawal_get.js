import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { checkErrMsg } from '../../../src/responseChecker';

describe('Withdrawal get', () => {
  // TODO изменить тесты - сделать вывод и получить этот id
  // TODO тесты зависимы от окружения
  it('C19361 (-) Get - withdrawal not found - auth', async () => {
    await userList.loginWithRub();
    const { data } = await socket.send('BANKING:withdrawal-get', { id: 205 });
    // console.log(data);
    checkErrMsg(data, 404, 'Выплата не найдена');
  });

  it('C19362 (+) Get - 100 RUB money-transfer - @dev ', async () => {
    await userList.loginWithRub();
    const { data } = await socket.send('BANKING:withdrawal-get', { id: 163 });
    // console.log(data);
    expect(data.id).equal(163);
    expect(data.time).equal(1559039814000);
    expect(data.paymentSystem).equal('money-transfer');
    expect(data.amount).equal(100);
    expect(data.status).equal(1);
    expect(data.wallet).equal('417');
  });

  it('C19363 (+) Get - 100 RUB card_rub @dev', async () => {
    await userList.loginWithRub();
    const { data } = await socket.send('BANKING:withdrawal-get', { id: 179 });
    // console.log(data);
    expect(data.id).equal(179);
    expect(data.time).equal(1559126426000);
    expect(data.paymentSystem).equal('card_rub');
    expect(data.amount).equal(100);
    expect(data.status).equal(0);
    expect(data.wallet).equal('5536913759650035');
  });

  it('C19364 (-) Get - Bad request, id is required ', async () => {
    const { data } = await socket.send('BANKING:withdrawal-get', { id: null });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, id is required');
  });
});
