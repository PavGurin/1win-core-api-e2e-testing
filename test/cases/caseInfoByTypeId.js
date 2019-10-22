import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { checkCaseInfoByTypeId } from '../../src/expects/exCases';
import { getNewSocket } from '../global';

describe('Get cases by type id', () => {
  let socket;

  beforeAll(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it('C1461825 - TypeId = 1', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 1);
    checkCaseInfoByTypeId(data, 0, 1, 2);
    checkCaseInfoByTypeId(data, 1, 1, 11);
    checkCaseInfoByTypeId(data, 2, 1, 18);
  });

  it('C1461826 - TypeId = 2', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 2);
    checkCaseInfoByTypeId(data, 0, 2, 3);
    checkCaseInfoByTypeId(data, 1, 2, 10);
    checkCaseInfoByTypeId(data, 2, 2, 19);
  });

  it('C1461827 - TypeId = 3', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 3);
    checkCaseInfoByTypeId(data, 0, 3, 4);
    checkCaseInfoByTypeId(data, 1, 3, 12);
    checkCaseInfoByTypeId(data, 2, 3, 20);
  });

  it('C1461828 - TypeId = 4', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 4);
    checkCaseInfoByTypeId(data, 0, 4, 5);
    checkCaseInfoByTypeId(data, 1, 4, 13);
    checkCaseInfoByTypeId(data, 2, 4, 21);
  });

  it('C1461829 - TypeId = 5', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 5);
    checkCaseInfoByTypeId(data, 0, 5, 6);
    checkCaseInfoByTypeId(data, 1, 5, 22);
    checkCaseInfoByTypeId(data, 2, 5, 23);
  });

  it('C1461830 - TypeId = 6', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 6);
    checkCaseInfoByTypeId(data, 0, 6, 7);
    checkCaseInfoByTypeId(data, 1, 6, 24);
    checkCaseInfoByTypeId(data, 2, 6, 25);
  });

  it('C1461831 - TypeId = 7', async () => {
    const { data } = await cases.getCaseInfoByTypeId(socket, 7);
    checkCaseInfoByTypeId(data, 0, 7, 8);
    checkCaseInfoByTypeId(data, 1, 7, 26);
    checkCaseInfoByTypeId(data, 2, 7, 28);
  });
});
