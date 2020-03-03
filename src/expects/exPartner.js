import { getCurrenciesFromDB } from '../methods/banking';
import { mysqlConnection } from '../methods/mysqlConnection';


export function checkStatsAllAfterOneRegistrtaion(receivedStatsAll, expectedRegistrationNumber) {
  expect(receivedStatsAll.values.regs).toEqual(expectedRegistrationNumber);
  expect(receivedStatsAll.values.date).toEqual(null);
  expect(receivedStatsAll.values.payment_sum).toEqual(0);
  expect(receivedStatsAll.values.deposits_amount).toEqual(0);
  expect(receivedStatsAll.values.deposits_sum).toEqual(0);
  expect(receivedStatsAll.values.payments_amount).toEqual(0);
  expect(receivedStatsAll.values.visits).toEqual(0);
  expect(receivedStatsAll.values.new_deposit).toEqual(0);
  expect(receivedStatsAll.values.bets_amount).toEqual(0);
  expect(receivedStatsAll.values.profit_bets_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_bets_sum).toEqual(0);
  expect(receivedStatsAll.values.profit_casino_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_casino_sum).toEqual(0);
  expect(receivedStatsAll.values.profit_case_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_case_sum).toEqual(0);
  expect(receivedStatsAll.values.difference).toEqual(0);
  expect(receivedStatsAll.values.epc).toEqual(0);
  expect(receivedStatsAll.values.withdrawal_sum).toEqual(0);
  expect(receivedStatsAll.values.profit_total_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_total_sum).toEqual(0);
  expect(receivedStatsAll.error).toEqual(false);
}

export function checkStatsAllAfterOneRegistrtaionCPA(receivedStatsAll, expectedRegistrationNumber) {
  expect(receivedStatsAll.values.regs).toEqual(expectedRegistrationNumber);
  expect(receivedStatsAll.values.date).toEqual(null);
  expect(receivedStatsAll.values.payment_sum).toEqual(0);
  expect(receivedStatsAll.values.deposits_amount).toEqual(0);
  expect(receivedStatsAll.values.deposits_sum).toEqual(0);
  expect(receivedStatsAll.values.payments_amount).toEqual(0);
  expect(receivedStatsAll.values.visits).toEqual(0);
  expect(receivedStatsAll.values.new_deposit).toEqual(0);
  expect(receivedStatsAll.values.bets_amount).toEqual(0);
  expect(receivedStatsAll.values.profit_bets_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_bets_sum).toEqual(0);
  expect(receivedStatsAll.values.profit_casino_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_casino_sum).toEqual(0);
  expect(receivedStatsAll.values.profit_case_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_case_sum).toEqual(0);
  expect(receivedStatsAll.values.difference).toEqual(0);
  expect(receivedStatsAll.values.epc).toEqual(0);
  expect(receivedStatsAll.values.withdrawal_sum).toEqual(0);
  expect(receivedStatsAll.values.profit_total_sum).toEqual(0);
  expect(receivedStatsAll.values.loss_total_sum).toEqual(0);
  expect(receivedStatsAll.values.cpa_payout_count).toEqual(0);
  expect(receivedStatsAll.values.cpa_payout_amount).toEqual(0);
  expect(receivedStatsAll.error).toEqual(false);
}

export function checkStatsDailyAfterOneRegistrtaion(receivedStatsDaily,
  expectedRegistrationNumber, expectedDate) {
  let expDate = '';
  expectedDate.getMonth() < 9 ? expDate += `${expectedDate.getFullYear()}-0${expectedDate.getMonth() + 1}-`
    : expDate += `${expectedDate.getFullYear()}-${expectedDate.getMonth() + 1}-`;
  expectedDate.getDate() < 10 ? expDate += `0${expectedDate.getDate()}` : expDate += `${expectedDate.getDate()}`;
  expect(receivedStatsDaily.day_regs).toEqual(expectedRegistrationNumber);
  expect(receivedStatsDaily.date).toEqual(expDate);
  expect(receivedStatsDaily.day_payment_sum).toEqual(0);
  expect(receivedStatsDaily.day_deposits_amount).toEqual(0);
  expect(receivedStatsDaily.day_deposits_sum).toEqual(0);
  expect(receivedStatsDaily.day_payments_amount).toEqual(0);
  expect(receivedStatsDaily.day_visits).toEqual(0);
  expect(receivedStatsDaily.day_new_deposit).toEqual(0);
  expect(receivedStatsDaily.day_bets_amount).toEqual(0);
  expect(receivedStatsDaily.day_profit_bets_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_bets_sum).toEqual(0);
  expect(receivedStatsDaily.day_profit_casino_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_casino_sum).toEqual(0);
  expect(receivedStatsDaily.day_profit_case_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_case_sum).toEqual(0);
  expect(receivedStatsDaily.day_difference).toEqual(0);
  expect(receivedStatsDaily.day_epc).toEqual(0);
  expect(receivedStatsDaily.day_withdrawal_sum).toEqual(0);
  expect(receivedStatsDaily.day_profit_total_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_total_sum).toEqual(0);
}

export function checkStatsDailyAfterOneRegistrtaionCPA(receivedStatsDaily,
  expectedRegistrationNumber, expectedDate) {
  let expDate = '';
  expectedDate.getMonth() < 9 ? expDate += `${expectedDate.getFullYear()}-0${expectedDate.getMonth() + 1}-`
    : expDate += `${expectedDate.getFullYear()}-${expectedDate.getMonth() + 1}-`;
  expectedDate.getDate() < 10 ? expDate += `0${expectedDate.getDate()}` : expDate += `${expectedDate.getDate()}`;
  expect(receivedStatsDaily.date).toEqual(expDate);
  expect(receivedStatsDaily.day_payment_sum).toEqual(0);
  expect(receivedStatsDaily.day_deposits_amount).toEqual(0);
  expect(receivedStatsDaily.day_deposits_sum).toEqual(0);
  expect(receivedStatsDaily.day_payments_amount).toEqual(0);
  expect(receivedStatsDaily.day_visits).toEqual(0);
  expect(receivedStatsDaily.day_new_deposit).toEqual(0);
  expect(receivedStatsDaily.day_bets_amount).toEqual(0);
  expect(receivedStatsDaily.day_profit_bets_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_bets_sum).toEqual(0);
  expect(receivedStatsDaily.day_profit_casino_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_casino_sum).toEqual(0);
  expect(receivedStatsDaily.day_profit_case_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_case_sum).toEqual(0);
  expect(receivedStatsDaily.day_difference).toEqual(0);
  expect(receivedStatsDaily.day_epc).toEqual(0);
  expect(receivedStatsDaily.day_withdrawal_sum).toEqual(0);
  expect(receivedStatsDaily.day_profit_total_sum).toEqual(0);
  expect(receivedStatsDaily.day_loss_total_sum).toEqual(0);
  expect(receivedStatsDaily.day_cpa_payout_count).toEqual(0);
  expect(receivedStatsDaily.day_cpa_payout_amount).toEqual(0);
}

export async function getCoeffForPayment(partnerCurrency, playerCurrency) {
  const currencyRates = await getCurrenciesFromDB(new Date());
  // console.log(currencyRates);

  const currencyPair = `${partnerCurrency}-${playerCurrency}`;
  let coeff;
  switch (currencyPair) {
    case 'RUB-USD':
      coeff = currencyRates.usd;
      break;
    case 'RUB-EUR':
      coeff = currencyRates.eur;
      break;
    case 'RUB-UAH':
      coeff = currencyRates.uah;
      break;
    case 'USD-RUB':
      coeff = 1 / currencyRates.usd;
      break;
    case 'USD-EUR':
      coeff = currencyRates.eur / currencyRates.usd;
      break;
    case 'USD-UAH':
      coeff = currencyRates.uah / currencyRates.usd;
      break;
    case 'EUR-RUB':
      coeff = 1 / currencyRates.eur;
      break;
    case 'EUR-USD':
      coeff = currencyRates.usd / currencyRates.eur;
      break;
    case 'EUR-UAH':
      coeff = currencyRates.uah / currencyRates.eur;
      break;
    case 'UAH-RUB':
      coeff = 1 / currencyRates.uah;
      break;
    case 'UAH-USD':
      coeff = currencyRates.usd / currencyRates.uah;
      break;
    case 'UAH-EUR':
      coeff = currencyRates.eur / currencyRates.eur;
      break;
    default: coeff = 1;
      break;
  }
  return coeff;
}

export async function getCoeffForCpaPayment(partnerCurrency) {
  const currencyRates = await getCurrenciesFromDB(new Date());
  // console.log(currencyRates);

  let coeff;
  switch (partnerCurrency) {
    case 'RUB':
      coeff = currencyRates.usd;
      break;
    case 'EUR':
      coeff = currencyRates.usd / currencyRates.eur;
      break;
    case 'UAH':
      coeff = currencyRates.usd / currencyRates.uah;
      break;
    default:
      coeff = 1;
      break;
  }
  return coeff;
}

export function round(value) {
  return Math.round(value * 100) / 100;
}


export async function checkPartnerPaymentBets(receivedStatsAll, receivedStatsDaily,
  BetProfitArray, partnerCurrency, playerCurrency) {
  expect(receivedStatsAll.values.payments_amount).toEqual(1);
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_payments_amount).toEqual(1);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  let profit = 0;
  let loss = 0;
  let difference = 0;

  const coeff = await getCoeffForPayment(partnerCurrency, playerCurrency);

  BetProfitArray.forEach(async (bet) => {
    (bet) <= 0
      ? profit += round(round(bet) * coeff)
      : loss += round(round(bet) * coeff);
    difference += round(round(bet) * coeff);
  });

  profit = round(profit).toFixed(2);
  loss = round(loss).toFixed(2);
  difference = round(difference).toFixed(2);

  const payment = difference / 2;
  // console.log((caseCost - caseProfit) * coeff);
  // console.log(payment);

  expect(receivedStatsAll.values.profit_bets_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsAll.values.loss_bets_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsDaily.day_profit_bets_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsDaily.day_loss_bets_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsAll.values.profit_total_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsAll.values.loss_total_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsAll.values.profit_total_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsDaily.day_loss_total_sum.toFixed(2)).toEqual(loss);


  expect(receivedStatsAll.values.difference.toFixed(2)).toEqual(difference);
  expect(receivedStatsDaily.day_difference.toFixed(2)).toEqual(difference);

  // из-за проблем округления может быть разница в 1 копейку
  // в received и expected
  // поэтому проверяем что received и expected равны с точностью 0,005
  // https://jestjs.io/docs/en/expect#tobeclosetonumber-numdigits
  expect(receivedStatsAll.values.payment_sum).toBeCloseTo(payment);
  expect(receivedStatsAll.values.epc).toBeCloseTo(payment);
  expect(receivedStatsDaily.day_payment_sum).toBeCloseTo(payment);
  expect(receivedStatsDaily.day_epc).toBeCloseTo(payment);
}

export async function checkPartnerPaymentCase(receivedStatsAll, receivedStatsDaily,
  caseCostProfitArray, partnerCurrency, playerCurrency) {
  expect(receivedStatsAll.values.payments_amount).toEqual(caseCostProfitArray.length);
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_payments_amount).toEqual(caseCostProfitArray.length);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  let profit = 0;
  let loss = 0;
  let difference = 0;

  const coeff = await getCoeffForPayment(partnerCurrency, playerCurrency);

  caseCostProfitArray.forEach(async (caseN) => {
    (caseN.caseCost - caseN.profit) <= 0
      ? profit += round(round(caseN.profit - caseN.caseCost) * coeff)
      : loss += round(round(caseN.caseCost - caseN.profit) * coeff);
    difference += round(round(caseN.caseCost - caseN.profit) * coeff);
  });

  profit = round(profit).toFixed(2);
  loss = round(loss).toFixed(2);
  difference = round(difference).toFixed(2);

  const payment = difference / 2;
  // console.log((caseCost - caseProfit) * coeff);
  // console.log(payment);

  expect(receivedStatsAll.values.profit_case_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsAll.values.loss_case_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsDaily.day_profit_case_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsDaily.day_loss_case_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsAll.values.profit_total_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsAll.values.loss_total_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsAll.values.profit_total_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsDaily.day_loss_total_sum.toFixed(2)).toEqual(loss);


  expect(receivedStatsAll.values.difference.toFixed(2)).toEqual(difference);
  expect(receivedStatsDaily.day_difference.toFixed(2)).toEqual(difference);

  // из-за проблем округления может быть разница в 1 копейку
  // в received и expected
  // поэтому проверяем что received и expected равны с точностью 0,005
  // https://jestjs.io/docs/en/expect#tobeclosetonumber-numdigits
  expect(receivedStatsAll.values.payment_sum).toBeCloseTo(payment);
  expect(receivedStatsAll.values.epc).toBeCloseTo(payment);
  expect(receivedStatsDaily.day_payment_sum).toBeCloseTo(payment);
  expect(receivedStatsDaily.day_epc).toBeCloseTo(payment);
}


// eslint-disable-next-line spaced-comment
/**
 * caseCostProfitArray - пары из суммы кейса и выигрыша, пример
 * [{ caseCost: 10, profit: 31.32 }, { caseCost: 10, profit: 3.9 }],
**/
export async function checkPartnerPaymentCasesCPA(receivedStatsAll, receivedStatsDaily,
  caseCostProfitArray, expectedPaymentAmountUsd, partnerCurrency, playerCurrency) {
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  let profit = 0;
  let loss = 0;
  let difference = 0;

  const coeff = await getCoeffForPayment(partnerCurrency, playerCurrency);
  const coeffCpaPayment = await getCoeffForCpaPayment(partnerCurrency);

  caseCostProfitArray.forEach(async (caseN) => {
    (caseN.caseCost - caseN.profit) <= 0
      ? profit += round(round(caseN.profit - caseN.caseCost) * coeff)
      : loss += round(round(caseN.caseCost - caseN.profit) * coeff);
    difference += round(round(caseN.caseCost - caseN.profit) * coeff);
  });

  profit = round(profit).toFixed(2);
  loss = round(loss).toFixed(2);
  difference = round(difference).toFixed(2);

  let paymentCPA;
  expectedPaymentAmountUsd !== 0
    ? paymentCPA = round(expectedPaymentAmountUsd * coeffCpaPayment).toFixed(2)
    : paymentCPA = '0.00';

  expect(receivedStatsAll.values.profit_case_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsAll.values.loss_case_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsDaily.day_profit_case_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsDaily.day_loss_case_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsAll.values.profit_total_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsAll.values.loss_total_sum.toFixed(2)).toEqual(loss);

  expect(receivedStatsAll.values.profit_total_sum.toFixed(2))
    .toEqual(profit);
  expect(receivedStatsDaily.day_loss_total_sum.toFixed(2)).toEqual(loss);


  expect(receivedStatsAll.values.difference.toFixed(2)).toEqual(difference);
  expect(receivedStatsDaily.day_difference.toFixed(2)).toEqual(difference);

  if (paymentCPA !== '0.00') {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(1);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(1);
  } else {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(0);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(0);
  }

  expect(receivedStatsAll.values.cpa_payout_amount.toFixed(2))
    .toEqual(paymentCPA);
  expect(receivedStatsDaily.day_cpa_payout_amount.toFixed(2))
    .toEqual(paymentCPA);
}

export async function checkUserMetaCpaPending(userId, value = true) {
  const result = await mysqlConnection.executeQuery(`select value from 1win.ma_users_meta where id_user = ${userId} and ma_users_meta.key = 'CPA_PAYOUT';`);
  // console.log(result);
  value ? expect(result[0].value).toEqual('PENDING') : expect(result[0]).toEqual(undefined);
}

export async function checkUserMetaCpaWaitForSec(userId, value = true) {
  const result = await mysqlConnection.executeQuery(`select value from 1win.ma_users_meta where id_user = ${userId} and ma_users_meta.key = 'CPA_PAYOUT';`);
  value ? expect(result[0].value).toEqual('WAITING_SECURITY') : expect(result[0]).toEqual(undefined);
}
