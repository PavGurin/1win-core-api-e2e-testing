import { getCurrenciesFromDB } from '../methods/banking';
import { mysqlConnection } from '../methods/mysqlConnection';
import { partner } from '../methods/partner';
import { formatDateYyyyMmDd } from '../methods/utils';

// из-за проблем округления может быть разница в 1 копейку
// в received и expected
// поэтому для сумм денег проверяем что received и expected равны с точностью 0,01
// https://github.com/jest-community/jest-extended#tobewithinstart-end
// для верхней границы берем + 0,011, т.к. проверяется < а не <=

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
  const expDate = formatDateYyyyMmDd(expectedDate);
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
  const expDate = formatDateYyyyMmDd(expectedDate);
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

export async function getCurrencyExchangeCoeff(convertToCurrency, covertFromCurrency) {
  const currencyRates = await getCurrenciesFromDB(new Date());
  // console.log(currencyRates);

  const currencyPair = `${convertToCurrency}-${covertFromCurrency}`;
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
      coeff = currencyRates.eur / currencyRates.uah;
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
  return parseFloat((Math.round(value * 100) / 100).toFixed(2));
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

  const coeff = await getCurrencyExchangeCoeff(partnerCurrency, playerCurrency);

  BetProfitArray.forEach(async (bet) => {
    (bet) <= 0
      ? profit += round(round(bet) * coeff)
      : loss += round(round(bet) * coeff);
    difference += round(round(bet) * coeff);
  });

  profit = round(profit);
  loss = round(loss);
  difference = round(difference);

  const payment = round(difference / 2);
  // console.log((caseCost - caseProfit) * coeff);
  // console.log(payment);

  expect(receivedStatsAll.values.profit_bets_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_bets_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsDaily.day_profit_bets_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_bets_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);


  expect(receivedStatsAll.values.difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);
  expect(receivedStatsDaily.day_difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);

  expect(receivedStatsAll.values.payment_sum)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsAll.values.epc)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsDaily.day_payment_sum)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsDaily.day_epc)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
}


// eslint-disable-next-line spaced-comment
/**
 * caseCostProfitArray - пары из суммы кейса и выигрыша, пример
 * [{ caseCost: 10, profit: 31.32 }, { caseCost: 10, profit: 3.9 }],
 **/

export async function calculateExpectedCasePayments(caseCostProfitArray,
  partnerCurrency, playerCurrency) {
  let profit = 0;
  let loss = 0;
  let difference = 0;

  const coeff = await getCurrencyExchangeCoeff(partnerCurrency, playerCurrency);
  caseCostProfitArray.forEach(async (caseN) => {
    (caseN.caseCost - caseN.profit) <= 0
      ? profit += round(round(caseN.profit - caseN.caseCost) * coeff)
      : loss += round(round(caseN.caseCost - caseN.profit) * coeff);
    difference += round(round(caseN.caseCost - caseN.profit) * coeff);
  });

  profit = round(profit);
  loss = round(loss);
  difference = round(difference);

  const payment = round(difference / 2);
  return {
    profit, loss, difference, payment,
  };
}

export async function calculateExpectedCpaPayments(expectedPaymentAmountUsd, partnerCurrency) {
  const coeffCpaPayment = await getCoeffForCpaPayment(partnerCurrency);
  let paymentCPA;
  expectedPaymentAmountUsd !== 0
    ? paymentCPA = round(expectedPaymentAmountUsd * coeffCpaPayment)
    : paymentCPA = 0;
  return paymentCPA;
}

export async function getHybridCpaProfit(partnerId, sourceId) {
  if (!sourceId) {
    const [result] = await mysqlConnection.executeQuery(` select sum(event_value) from 1win_partner.stats_v2  
              where event_source_id in (select broadcaster_id from 1win_partner.stats_v2 where event = 'CPA_PAYOUT') 
               and event = 'PAYMENT' and  partner_id = ${partnerId};`);
    return result['sum(event_value)'];
  } else { // eslint-disable-line no-else-return
    const [result] = await mysqlConnection.executeQuery(` select sum(event_value) from 1win_partner.stats_v2  
              where event_source_id in (select broadcaster_id from 1win_partner.stats_v2 where event = 'CPA_PAYOUT') 
               and event = 'PAYMENT' and  partner_id = ${partnerId} and source_id = ${sourceId};`);
    return result['sum(event_value)'];
  }
}

export async function calculateExpectedCaseHybridPayments(partnerId, caseCostProfitArray,
  expectedCpaPaymentAmountUsd, expectedCpaPaymentCount, partnerCurrency, playerCurrency, sourceId) {
  const {
    profit, loss, difference,
  } = await calculateExpectedCasePayments(caseCostProfitArray, partnerCurrency, playerCurrency);

  let cpaProfit = parseFloat(await getHybridCpaProfit(partnerId, sourceId));
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(cpaProfit)) {
    cpaProfit = 0;
  }
  const payment = round(difference / 2 + cpaProfit);

  const paymentCPA = await calculateExpectedCpaPayments(expectedCpaPaymentAmountUsd
      * expectedCpaPaymentCount, partnerCurrency);

  const paymentRs = payment - cpaProfit;

  return {
    profit, loss, difference, cpaProfit, payment, paymentCPA, paymentRs,
  };
}

export async function checkPartnerPaymentCase(receivedStatsAll, receivedStatsDaily,
  caseCostProfitArray, partnerCurrency, playerCurrency) {
  expect(receivedStatsAll.values.payments_amount).toEqual(caseCostProfitArray.length);
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_payments_amount).toEqual(caseCostProfitArray.length);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  const {
    profit, loss, difference, payment,
  } = await calculateExpectedCasePayments(caseCostProfitArray, partnerCurrency, playerCurrency);

  expect(receivedStatsAll.values.profit_case_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_case_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsDaily.day_profit_case_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_case_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);


  expect(receivedStatsAll.values.difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);
  expect(receivedStatsDaily.day_difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);

  expect(receivedStatsAll.values.payment_sum)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsAll.values.epc)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsDaily.day_payment_sum)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsDaily.day_epc)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
}

export async function checkPartnerPaymentCasesCPA(receivedStatsAll, receivedStatsDaily,
  caseCostProfitArray, expectedPaymentAmountUsd, partnerCurrency, playerCurrency) {
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  const {
    profit, loss, difference,
  } = await calculateExpectedCasePayments(caseCostProfitArray, partnerCurrency, playerCurrency);

  const paymentCPA = await calculateExpectedCpaPayments(expectedPaymentAmountUsd, partnerCurrency);

  expect(receivedStatsAll.values.profit_case_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_case_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsDaily.day_profit_case_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_case_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);


  expect(receivedStatsAll.values.difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);
  expect(receivedStatsDaily.day_difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);

  if (paymentCPA !== 0) {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(1);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(1);
  } else {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(0);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(0);
  }

  expect(receivedStatsAll.values.cpa_payout_amount)
    .toBeWithin(round(paymentCPA - 0.01), round(paymentCPA + 0.01) + 0.001);
  expect(receivedStatsDaily.day_cpa_payout_amount)
    .toBeWithin(round(paymentCPA - 0.01), round(paymentCPA + 0.01) + 0.001);
}

export async function checkPartnerPaymentCasesHybrid(receivedStatsAll, receivedStatsDaily,
  caseCostProfitArray, expectedCpaPaymentAmountUsd, expectedCpaPaymentCount,
  partnerCurrency, playerCurrency, partnerId) {
  expect(receivedStatsAll.values.payments_amount)
    .toEqual(caseCostProfitArray.length + expectedCpaPaymentCount);
  expect(receivedStatsDaily.day_payments_amount)
    .toEqual(caseCostProfitArray.length + expectedCpaPaymentCount);
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  const {
    profit, loss, difference, cpaProfit, payment, paymentCPA,
  } = await calculateExpectedCaseHybridPayments(partnerId, caseCostProfitArray,
    expectedCpaPaymentAmountUsd, expectedCpaPaymentCount, partnerCurrency, playerCurrency);

  expect(receivedStatsAll.values.profit_case_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_case_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsDaily.day_profit_case_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_case_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);


  expect(receivedStatsAll.values.difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);
  expect(receivedStatsDaily.day_difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);

  expect(receivedStatsAll.values.payment_sum)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsAll.values.epc)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsDaily.day_payment_sum)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);
  expect(receivedStatsDaily.day_epc)
    .toBeWithin(round(payment - 0.01), round(payment + 0.01) + 0.001);

  if (paymentCPA !== 0) {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(expectedCpaPaymentCount);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(expectedCpaPaymentCount);
  } else {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(0);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(0);
  }

  expect(receivedStatsAll.values.cpa_payout_amount)
    .toBeWithin(round(paymentCPA - 0.01), round(paymentCPA + 0.01) + 0.001);
  expect(receivedStatsDaily.day_cpa_payout_amount)
    .toBeWithin(round(paymentCPA - 0.01), round(paymentCPA + 0.01) + 0.001);

  expect(receivedStatsAll.values.cpa_profit)
    .toBeWithin(round(cpaProfit - 0.01), round(cpaProfit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_cpa_profit)
    .toBeWithin(round(cpaProfit - 0.01), round(cpaProfit + 0.01) + 0.001);
  expect(receivedStatsAll.values.rs_profit)
    .toBeWithin(round(payment - cpaProfit - 0.01), round(payment - cpaProfit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_rs_profit)
    .toBeWithin(round(payment - cpaProfit - 0.01), round(payment - cpaProfit + 0.01) + 0.001);
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

export async function checkPartnerPaymentBetsCPA(receivedStatsAll, receivedStatsDaily,
  BetProfitArray, expectedPaymentAmountUsd, partnerCurrency, playerCurrency) {
  expect(receivedStatsAll.values.regs).toEqual(1);
  expect(receivedStatsDaily.day_regs).toEqual(1);

  let profit = 0;
  let loss = 0;
  let difference = 0;

  const coeff = await getCurrencyExchangeCoeff(partnerCurrency, playerCurrency);

  BetProfitArray.forEach(async (betPrize) => {
    (betPrize) > 0
      ? profit += round(round(betPrize) * coeff)
      : loss += round(round(betPrize) * (-1) * coeff);
    difference += round(round(betPrize) * (-1) * coeff);
  });

  profit = round(profit);
  loss = round(loss);
  difference = round(difference);

  const paymentCPA = await calculateExpectedCpaPayments(expectedPaymentAmountUsd, partnerCurrency);

  expect(receivedStatsAll.values.profit_bets_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_bets_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsDaily.day_profit_bets_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_bets_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsAll.values.loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);

  expect(receivedStatsAll.values.profit_total_sum)
    .toBeWithin(round(profit - 0.01), round(profit + 0.01) + 0.001);
  expect(receivedStatsDaily.day_loss_total_sum)
    .toBeWithin(round(loss - 0.01), round(loss + 0.01) + 0.001);


  expect(receivedStatsAll.values.difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);
  expect(receivedStatsDaily.day_difference)
    .toBeWithin(round(difference - 0.01), round(difference + 0.01) + 0.001);

  if (paymentCPA !== 0) {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(1);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(1);
  } else {
    expect(receivedStatsAll.values.cpa_payout_count).toEqual(0);
    expect(receivedStatsDaily.day_cpa_payout_count).toEqual(0);
  }

  expect(receivedStatsAll.values.cpa_payout_amount)
    .toBeWithin(round(paymentCPA - 0.01), round(paymentCPA + 0.01) + 0.001);
  expect(receivedStatsDaily.day_cpa_payout_amount)
    .toBeWithin(round(paymentCPA - 0.01), round(paymentCPA + 0.01) + 0.001);
}

export async function checkSubpartnerPayment(partnerCookie, partnerCurrency, subpartnerCurrency,
  expectedSubpartnerIncome) {
  const { data: { partners: [p0] } } = await partner.getStatsSubpartner(partnerCookie);
  expect(p0.partnerSum)
    .toBeWithin(round(expectedSubpartnerIncome - 0.01),
      round(expectedSubpartnerIncome + 0.01) + 0.001);
  const coeff = await getCurrencyExchangeCoeff(partnerCurrency, subpartnerCurrency);
  const incomeFromSubpartner = round(p0.partnerSum * 0.05 * coeff);
  expect(p0.webmasterSum)
    .toBeWithin(round(incomeFromSubpartner - 0.02), round(incomeFromSubpartner + 0.02) + 0.01);
}

export async function checkSourceProfit(cookie, sourceId, expectedBalance, expectedProfit) {
  const sourceStats = await partner.getSourceIncome(cookie, sourceId);
  // console.log(sourceStats);
  if (expectedBalance === 0) {
    expect(sourceStats.balance).toEqual(0);
  } else {
    expect(parseFloat(sourceStats.balance))
      .toBeWithin(expectedBalance - 0.05, expectedBalance + 0.051);
  }
  if (expectedProfit === 0) {
    expect(sourceStats.profit).toEqual(0);
  } else {
    expect(parseFloat(sourceStats.profit))
      .toBeWithin(expectedProfit - 0.05, expectedProfit + 0.051);
  }
}

export function checkSources(receivedSources, expectedSources) {
  expectedSources.forEach((source) => {
    const receivedSource = receivedSources.find(received => received.id === source.id);
    expect(receivedSource).not.toBeUndefined();
    expect(receivedSource.name).toEqual(source.name);
    expect(receivedSource.verification_status).toEqual('pending');
    expect(receivedSource.is_sub_partner).toEqual(source.is_sub_partner);
  });
}

export function checkChatGreetingMessage(receivedMessages, partnerId, regTime) {
  expect(receivedMessages.length).toEqual(1);
  expect(receivedMessages[0].id).toBeNumber();
  expect(receivedMessages[0].chatId).toEqual(partnerId);
  expect(receivedMessages[0].text).toEqual('\n'
      + '    Добрый день!\n'
      + '\n'
      + '    Мы очень рады, что Вы присоединились к нашей партнерской программе.\n\n'
      + '    С нами Вы можете работать по моделям RevShare, CPA и Hybrid.\n'
      + '    По всем вопросам Вы можете обращаться в данный чат, а также к менеджеру в Telegram – @win_one\n'
      + '    ');
  expect(receivedMessages[0].time).not.toBeBefore(regTime);
  expect(receivedMessages[0].partnerReadTime).toEqual(null);
  expect(receivedMessages[0].adminReadTime).toEqual(null);
  expect(receivedMessages[0].sentByAdmin).toEqual(1);
  expect(receivedMessages[0].file).toEqual(null);
  expect(receivedMessages[0].fileType).toEqual(null);
  expect(receivedMessages[0].isEmailSent).toEqual(0);
  expect(receivedMessages[0].name).toEqual(null);
  expect(receivedMessages[0].email).toEqual(null);
  expect(receivedMessages[0].sender).toEqual('Поддержка');
}

export function checkPartnerError(received, expectedCode, expectedMessage) {
  expect(received.error).toEqual(true);
  expect(received.error_code).toEqual(expectedCode);
  expect(received.message).toEqual(expectedMessage);
}

export function checkPartnerWithdrawalSuccess(profitAfterWithdrawal,
  balanceAfterWithdrawal, profitBeforeWithdrawal, balanceBeforeWithdrawal, withdrawalAmount) {
  expect(profitAfterWithdrawal).toEqual(profitBeforeWithdrawal);
  expect(balanceAfterWithdrawal.toString())
    .toEqual((balanceBeforeWithdrawal - withdrawalAmount).toString());
}
