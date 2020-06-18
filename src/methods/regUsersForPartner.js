import { caseCostIdMap } from '../caseCostIdMap';
import { register } from './register';
import { partner } from './partner';
import { banking } from './banking';
import { cases } from './cases';

// регистрация юзеров 1вин в заданной валюте, каждый юзер играет в кейс стоимостью caseCost
// numCasesPlayed число раз
// partnerId, promocodeId, sourceId, depositAmount - необязательные параметры,
// при их указании для юзера будут также созданы FIRST_DEPOSIT и DEPOSIT
export async function regUsersAndPlayCases(numUsers, numUserCasesPlayed, caseCost,
  usersCurrency, promocode, partnerId, promocodeId, sourceId, depositAmount) {
  /* eslint no-await-in-loop: off */
  const caseId = caseCostIdMap[usersCurrency].find(item => item.cost === caseCost).id;
  const caseResults = [];
  for (let i = 0; i < numUsers; i++) {
    const { data: user } = await register.oneClickRegWithPromocode(promocode, usersCurrency);
    if (partnerId && promocodeId && sourceId && depositAmount) {
      await partner.addFirstDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
      await partner.addDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
    }
    // console.log(user.id);
    await banking.setBalance(user.id, depositAmount);
    for (let j = 0; j < numUserCasesPlayed; j++) {
      const { data: caseWin } = await cases.playCaseWithoutChance(caseId);
      // console.log(caseWin);
      caseResults.push({ caseCost, profit: caseWin.result });
    }
  }
  return caseResults;
}
