import { userList } from '../../src/methods/userList';
import { userPool } from '../../src/methods/userPool';
import { cases } from '../../src/methods/cases';
import { checkCaseResult } from '../../src/expects/exCases';
import { checkErrMsg } from '../../src/responseChecker';
import { sleep } from '../../src/methods/utils';

describe('Valid сases play RUB', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 12000;
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRub(USERS_NUMBER, BALANCE);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    sleep(3);
  });

  it('C608898 - (+) play  cases 10', async () => {
    const { data } = await cases.playCaseWithoutChance(10);

    checkErrMsg(data, 400, 'Bad request');
  });

  it('C484968 - (+) play  cases 1', async () => {
    const data = await cases.playCaseWithoutChance(1);

    checkCaseResult(data, 500, 10);
  });
  it('C484969 - (+) play  cases 2', async () => {
    const data = await cases.playCaseWithoutChance(2);

    checkCaseResult(data, 200, 5);
  });

  it('C484970 - (+) play  cases 3', async () => {
    const data = await cases.playCaseWithoutChance(3);

    checkCaseResult(data, 500, 50);
  });
  it('C484971 - (+) play  cases 4', async () => {
    const data = await cases.playCaseWithoutChance(4);

    checkCaseResult(data, 5000, 100);
  });
  it('C484972 - (+) play  cases 5', async () => {
    const data = await cases.playCaseWithoutChance(5);

    checkCaseResult(data, 100, 2);
  });
  it('C484973 - (+) play  cases 6', async () => {
    const data = await cases.playCaseWithoutChance(6);

    checkCaseResult(data, 10000, 500);
  });
  it('C484974 - (+) play  cases 7', async () => {
    const data = await cases.playCaseWithoutChance(7);

    checkCaseResult(data, 10000, 2500);
  });
  it('C484975 - (+) play  cases 8', async () => {
    const data = await cases.playCaseWithoutChance(8);

    checkCaseResult(data, 50000, 5000);
  });

  it('C484976 - (-) invalid id', async () => {
    const { data } = await cases.playCaseWithoutChance(9);

    checkErrMsg(data, 400, 'Bad request');
  });
});
