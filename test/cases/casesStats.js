import {
  checkConvertation, checkOpenedAmount, checkStatsValid, compareCasesStats,
} from '../../src/expects/exCases';
import { register } from '../../src/methods/register';
import { banking, getCurrenciesFromDB } from '../../src/methods/banking';
import { cases } from '../../src/methods/cases';
import { sleep } from '../../src/methods/utils';

describe('Cases stats tests', () => {
  it('C1802220 - get cases-stats, unregistered user', async () => {
    const stats = await socket.casesStats;
    // console.log(stats);
    checkStatsValid(stats);
  });

  it('C1802221 - get cases-stats, registered user', async () => {
    await register.oneClickReg();
    const stats = await socket.casesStats;
    // console.log(stats);
    checkStatsValid(stats);
  });

  it('C1802222 - check stats after 10 seconds (should be new push)', async () => {
    const stats = await socket.casesStats;
    await sleep(10500);
    const stats2 = await socket.casesStats;
    // console.log(stats);
    // console.log(stats2);
    compareCasesStats(stats, stats2, false);
  });

  it('C1802223 - stats are not updated in less than 10 seconds', async () => {
    const stats = await socket.casesStats;
    await sleep(5000);
    const stats2 = await socket.casesStats;
    // console.log(stats);
    // console.log(stats2);
    compareCasesStats(stats, stats2, true);
  });

  it('C1802225 - check convertation', async () => {
    const stats = await socket.casesStats;
    // console.log(stats);
    const currencies = await getCurrenciesFromDB(new Date());
    // console.log(currencies);
    checkConvertation(stats, currencies);
  });

  it('C1802228 - check opened amounts', async () => {
    const stats = await socket.casesStats;
    checkOpenedAmount(stats);
  });
});
