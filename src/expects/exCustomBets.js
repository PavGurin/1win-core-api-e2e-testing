import { dateRemoveTZ, isKyrillic, isLatinic } from '../methods/utils';
import { getCurrencyExchangeCoeff } from './exPartner';
import { banking } from '../methods/banking';


/**
 * для клиентских запросов
 */

export function checkLangsValid(received) {
  expect(received).toBeArray();
  received.forEach((language) => {
    expect(language.id).toBeGreaterThan(0);
    expect(language.value).toBeString();
    expect(isKyrillic(language.titleRu)).toEqual(true);
    expect(isLatinic(language.titleWorld)).toEqual(true);
    expect(language.isDisabled === 0 || language.isDisabled === 1).toEqual(true);
  });
}

export function checkGroup(receivedGroups, expectedGroup, lang) {
  const receivedGroup = receivedGroups.find(group => group.id === expectedGroup.id);
  expect(dateRemoveTZ(receivedGroup.createdAt)).toEqual(expectedGroup.createdAt);
  expect(dateRemoveTZ(receivedGroup.updatedAt)).toEqual(expectedGroup.updatedAt);
  if (lang === 'ru') {
    expect(receivedGroup.title).toEqual(expectedGroup.titleRu);
  } else if (lang === 'en') {
    expect(receivedGroup.title).toEqual(expectedGroup.titleEn);
  }
  expect(receivedGroup.isDisabled).toEqual(0);
  expect(receivedGroup.userAuthorId).toEqual(1001);
}

export function checkEvent(receivedEvents, expectedEvent, expectedResults, lang, isCalculated = 0) {
  // console.log(receivedEvents);
  const receivedEvent = receivedEvents.find(event => event.id === expectedEvent.id);
  // console.log(receivedEvent);
  expect(receivedEvent.groupId).toEqual(expectedEvent.groupId);
  expect(dateRemoveTZ(receivedEvent.createdAt)).toEqual(expectedEvent.createdAt);
  expect(dateRemoveTZ(receivedEvent.updatedAt)).toEqual(expectedEvent.updatedAt);
  expect(dateRemoveTZ(receivedEvent.startAt)).toEqual(expectedEvent.startAt);
  expect(dateRemoveTZ(receivedEvent.stopAt)).toEqual(expectedEvent.stopAt);
  expect(receivedEvent.isDisabled).toEqual(0);
  expect(receivedEvent.userAuthorId).toEqual(1001);
  expect(receivedEvent.isCalculated).toEqual(isCalculated);
  if (lang === 'ru') {
    expect(receivedEvent.title).toEqual(expectedEvent.titleRu);
    expect(receivedEvent.description).toEqual(expectedEvent.descriptionRu);
  } else if (lang === 'en') {
    expect(receivedEvent.title).toEqual(expectedEvent.titleEn);
    expect(receivedEvent.description).toEqual(expectedEvent.descriptionEn);
  }
  if (expectedResults) {
    receivedEvent.results.forEach((result, i) => {
      expect(result.id).toEqual(expectedResults[i].id);
      expect(result.eventId).toEqual(expectedResults[i].eventId);
      expect(result.userAuthorId).toEqual(1001);
      expect(result.factor).toEqual(expectedResults[i].factor);
      expect(result.isDisabled).toEqual(0);
      expect(result.outcome).toEqual(0);
      expect(dateRemoveTZ(result.createdAt)).toEqual(expectedResults[i].createdAt);
      expect(dateRemoveTZ(result.updatedAt)).toEqual(expectedResults[i].updatedAt);
      if (lang === 'ru') {
        expect(result.title).toEqual(expectedResults[i].titleRu);
        expect(result.description).toEqual(expectedResults[i].descriptionRu);
      } else if (lang === 'en') {
        expect(result.title).toEqual(expectedResults[i].titleEn);
        expect(result.description).toEqual(expectedResults[i].descriptionEn);
      }
    });
  } else if (expectedResults === false) {
    expect(JSON.stringify(receivedEvent.results)).toEqual('[]');
  } else {
    expect(receivedEvent.results).toBeUndefined();
  }
}

export async function checkMaxBetAmount(beforeBet, afterBet, betAmount, betCurrency) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const currency of Object.entries(afterBet)) {
    if (currency[0] === betCurrency) {
      expect(parseFloat((beforeBet[betCurrency] - afterBet[betCurrency]).toFixed(2)))
        .toBeCloseTo(parseFloat(betAmount.toFixed(2)), 1);
    } else {
      const coeff = await getCurrencyExchangeCoeff(currency[0], betCurrency);
      // expect((beforeBet[currency[0]] - afterBet[currency[0]]).toFixed(2))
      //   .toEqual((betAmount * coeff).toFixed(2));
      expect(parseFloat((beforeBet[currency[0]] - afterBet[currency[0]]).toFixed(2)))
        .toBeCloseTo(parseFloat((betAmount * coeff).toFixed(2)), 1);
    }
  }
}

export async function checkSuccessfulBet(data, expectedBalanceAfterBet) {
  expect(data.status).toEqual(200);
  expect(data.someString.status).toEqual(200);
  expect(data.someString.error).toEqual(false);
  const balance = await banking.balanceCheck();
  expect(balance).toEqual(expectedBalanceAfterBet);
}
