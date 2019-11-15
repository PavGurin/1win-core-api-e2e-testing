import { userList } from '../../src/methods/userList';
import { cases } from '../../src/methods/cases';
import { sleep } from '../../src/methods/utils';

describe.skip('одновременные запросы на игру в кейсы', () => {
  beforeEach(async () => {
    await userList.loginWithRubUsdCase();
    sleep(3);
  });

  it('1 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('2 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('3 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('4 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];

    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('5 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('6 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('7 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('8 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('9 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });

  it('10 user одновременные запросы без подтверждения перевода', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(cases.playCaseWithoutChance(3));
    }
    await Promise.all(promises);
  });
});
