import { caseIdByCost } from '../caseCostIdMap';
import { register } from './register';
import { partner } from './partner';
import { banking } from './banking';
import { cases } from './cases';
import { Refund } from './BetsRefund';

// регистрация юзеров 1вин в заданной валюте, каждый юзер играет в кейс стоимостью caseCost
// numUserCasesPlayed число раз
// partnerId, promocodeId, sourceId, depositAmount - необязательные параметры,
// при их указании для юзера будут также созданы FIRST_DEPOSIT и DEPOSIT
export async function regUsersAndPlayCases(numUsers, numUserCasesPlayed, caseCost,
  usersCurrency, promocode, partnerId, promocodeId, sourceId, depositAmount) {
  /* eslint no-await-in-loop: off */
  const caseId = caseIdByCost(usersCurrency, caseCost);
  const caseResults = [];
  const userIds = [];
  for (let i = 0; i < numUsers; i++) {
    const { data: user } = await register.oneClickRegWithPromocode(promocode, usersCurrency);
    if (partnerId && promocodeId && sourceId && depositAmount) {
      await partner.addFirstDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
      await partner.addDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
    }
    userIds.push(user.id);
    // console.log(user.id);
    if (depositAmount) {
      await banking.setBalance(user.id, depositAmount);
    } else {
      await banking.setBalance(user.id, caseCost * numUserCasesPlayed);
    }
    for (let j = 0; j < numUserCasesPlayed; j++) {
      const { data: caseWin } = await cases.playCaseWithoutChance(caseId);
      // console.log(caseWin);
      caseResults.push({ caseCost, profit: caseWin.result });
    }
  }
  return { caseResults, userIds };
}

// регистрация юзеров 1вин в заданной валюте, каждый юзер делает ставки(ординар) суммой betAmount
// numUserBetsMake число раз
// partnerId, promocodeId, sourceId, depositAmount - необязательные параметры,
// при их указании для юзера будут также созданы FIRST_DEPOSIT и DEPOSIT
export async function regUsersAndSellBetsOrdinary(numUsers, numUserBetsMake, betAmount,
  usersCurrency, promocode, partnerId, promocodeId, sourceId, depositAmount) {
  /* eslint no-await-in-loop: off */
  const betResults = [];
  const userIds = [];
  for (let i = 0; i < numUsers; i++) {
    const { data: user } = await register.oneClickRegWithPromocode(promocode, usersCurrency);
    if (partnerId && promocodeId && sourceId && depositAmount) {
      await partner.addFirstDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
      await partner.addDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
    }
    userIds.push(user.id);
    // console.log(user.id);
    if (depositAmount) {
      await banking.setBalance(user.id, depositAmount);
    } else {
      await banking.setBalance(user.id, betAmount * numUserBetsMake);
    }
    for (let j = 0; j < numUserBetsMake; j++) {
      const price = await Refund.SellBetOrdinar(betAmount);
      betResults.push(betAmount - price);
    }
  }
  return { betResults, userIds };
}

// регистрация юзеров 1вин в заданной валюте, каждый юзер делает ставки(экспресс) суммой betAmount
// numUserBetsMake число раз
// partnerId, promocodeId, sourceId, depositAmount - необязательные параметры,
// при их указании для юзера будут также созданы FIRST_DEPOSIT и DEPOSIT
export async function regUsersAndSellBetsExpress(numUsers, numUserBetsMake, betAmount,
  usersCurrency, promocode, partnerId, promocodeId, sourceId, depositAmount) {
  /* eslint no-await-in-loop: off */
  const betResults = [];
  const userIds = [];
  for (let i = 0; i < numUsers; i++) {
    const { data: user } = await register.oneClickRegWithPromocode(promocode, usersCurrency);
    if (partnerId && promocodeId && sourceId && depositAmount) {
      await partner.addFirstDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
      await partner.addDeposit(partnerId, promocodeId, sourceId, user.id, depositAmount);
    }
    userIds.push(user.id);
    // console.log(user.id);
    if (depositAmount) {
      await banking.setBalance(user.id, depositAmount);
    } else {
      await banking.setBalance(user.id, betAmount * numUserBetsMake);
    }
    for (let j = 0; j < numUserBetsMake; j++) {
      const price = await Refund.SellBetExpress(betAmount);
      betResults.push(betAmount - price);
    }
  }
  return { betResults, userIds };
}
