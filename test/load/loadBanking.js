import { userPool } from '../../src/methods/userPool';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';

describe('одновременные запросы на перевод без подтверждения', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 100;
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithEmailMailru(USERS_NUMBER, BALANCE);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
  });

  it(' одновременные запросы без подтверждения перевода', async () => {
    // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs
  	// TODO необходимо проверять в БД количество записей о выводе и балане юзера
    const promises = [];

    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line no-await-in-loop
      promises.push(banking.transferCreateAll('lina.solodova.94@bk.ru', 100, 'RUB'));
    }

    await Promise.all(promises);
  });
});
