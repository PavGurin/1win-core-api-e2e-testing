import { cases } from '../../src/methods/cases';
import { register } from '../../src/methods/register';
import { checkCaseInfoByTypeId } from '../../src/expects/exCases';

describe('Get cases by type id', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C1630096 - TypeId = 0', async () => {
    const { data } = await cases.getCaseInfoByTypeId(0);
    checkCaseInfoByTypeId(data, 0, 0, 1);
    checkCaseInfoByTypeId(data, 1, 0, 10);
    checkCaseInfoByTypeId(data, 2, 0, 18);
  });

  it('C1461825 - TypeId = 1', async () => {
    const { data } = await cases.getCaseInfoByTypeId(1);
    checkCaseInfoByTypeId(data, 0, 1, 2);
    checkCaseInfoByTypeId(data, 1, 1, 11);
    checkCaseInfoByTypeId(data, 2, 1, 19);
  });

  it('C1461826 - TypeId = 2', async () => {
    const { data } = await cases.getCaseInfoByTypeId(2);
    checkCaseInfoByTypeId(data, 0, 2, 3);
    checkCaseInfoByTypeId(data, 1, 2, 12);
    checkCaseInfoByTypeId(data, 2, 2, 20);
  });

  it('C1461827 - TypeId = 3', async () => {
    const { data } = await cases.getCaseInfoByTypeId(3);
    checkCaseInfoByTypeId(data, 0, 3, 4);
    checkCaseInfoByTypeId(data, 1, 3, 13);
    checkCaseInfoByTypeId(data, 2, 3, 21);
  });

  it('C1461828 - TypeId = 4', async () => {
    const { data } = await cases.getCaseInfoByTypeId(4);
    checkCaseInfoByTypeId(data, 0, 4, 5);
    checkCaseInfoByTypeId(data, 1, 4, 14);
    checkCaseInfoByTypeId(data, 2, 4, 22);
  });

  it('C1461829 - TypeId = 5', async () => {
    const { data } = await cases.getCaseInfoByTypeId(5);
    checkCaseInfoByTypeId(data, 0, 5, 6);
    checkCaseInfoByTypeId(data, 1, 5, 15);
    checkCaseInfoByTypeId(data, 2, 5, 23);
  });

  it('C1461830 - TypeId = 6', async () => {
    const { data } = await cases.getCaseInfoByTypeId(6);
    checkCaseInfoByTypeId(data, 0, 6, 7);
    checkCaseInfoByTypeId(data, 1, 6, 16);
    checkCaseInfoByTypeId(data, 2, 6, 24);
  });

  it('C1461831 - TypeId = 7', async () => {
    const { data } = await cases.getCaseInfoByTypeId(7);
    checkCaseInfoByTypeId(data, 0, 7, 8);
    checkCaseInfoByTypeId(data, 1, 7, 17);
    checkCaseInfoByTypeId(data, 2, 7, 25);
  });
});
