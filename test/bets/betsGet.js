import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { checkError404, checkErrorMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';

describe('Bets get', () => {
  it('C22020 (-) user without bet history', async () => {
    // TODO -  зачем после реги авторизация?
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);

    const { data } = await socket.send('BETS:bets-get', {
      id: 23,
      language: null,
    });
    // console.log(data);
    checkError404(data, 'Ставка не найдена');
  });

  it('C22021 (-) without ID field', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);

    const { data } = await socket.send('BETS:bets-get', {
      language: null,
    });
    // console.log(data);
    checkErrorMsg(data, 'Bad request, id is required');
  });

  it('C22022 (-) empty ID field', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);

    const { data } = await socket.send('BETS:bets-get', {
      id: '',
      language: null,
    });
    // console.log(data);
    checkErrorMsg(data, 'Bad request, id should have a type of number, but found string');
  });

  it('C22023 (-) non authorized user get bet', async () => {
    const { data } = await socket.send('BETS:bets-get', {
      id: 23,
      language: null,
    });
    // console.log(data);
    checkError404(data, 'Ставка не найдена');
  });

  it('C22024 (+) get ordinary bet by id', async () => {
    const testBetId = 35;

    const { data: login } = await userList.loginWithRealMoney();
    const { data: getBet } = await socket.send('BETS:bets-get', {
      id: testBetId,
      language: null,
    });
    // console.log(data);
    expect(login.id).equal(getBet.id_user);
    expect(getBet.betType).equal('ordinary');
    expect(getBet.currency).equal('RUB');
    expect(getBet.id).equal(testBetId);
    for (let i = 0; i < getBet.selectionList.length; i++) {
      expect(getBet.selectionList[i].bet_id).equal(testBetId);
    }
  });

  it('C22025 (+) get express bet by id', async () => {
    const testBetId = 38;

    const { data: login } = await userList.loginWithRealMoney();
    const { data: getBet } = await socket.send('BETS:bets-get', {
      id: testBetId,
      language: null,
    });
    // console.log(getBet);
    expect(login.id).equal(getBet.id_user);
    expect(getBet.betType).equal('express');
    expect(getBet.currency).equal('RUB');
    expect(getBet.id).equal(testBetId);
    expect(getBet.selectionList.length).equal(2);
    // проверяет 'bet_id' каждой ставки экспресса (должно совпадать
    for (let i = 0; i < getBet.selectionList.length; i++) {
      expect(getBet.selectionList[i].bet_id).equal(testBetId);
    }
  });
});
