import { getUserBonusAmount } from '../methods/user';
import { banking } from '../methods/banking';

export async function checkBonus(userId, bet,
  expectedNewBonusAmount, expectedBetBonus, expectedBetProfitWithoutBonus) {
  expect(bet.status).toBe(2);
  expect(bet.profit.toFixed(2)).toBe(expectedBetProfitWithoutBonus.toFixed(2));
  expect(bet.promo_amount).toBe(expectedBetBonus);
  const newBonusAmount = await getUserBonusAmount(userId);
  expect(newBonusAmount).toBe(expectedNewBonusAmount.toString());
  const balance = await banking.balanceCheck();
  expect(balance.toFixed(2)).toEqual((expectedBetBonus + expectedBetProfitWithoutBonus).toFixed(2));
}

export async function checkExpressBonus(userId, bet,
  expectedNewBonusAmount, expectedBetBonus) {
  expect(bet.status).toBe(2);
  expect(bet.profit.toFixed(2)).not.toEqual('0.00');
  expect(bet.promo_amount).toBe(expectedBetBonus);
  const newBonusAmount = await getUserBonusAmount(userId);
  expect(newBonusAmount).toBe(expectedNewBonusAmount.toString());
  const balance = await banking.balanceCheck();
  expect(balance.toFixed(2)).toEqual((expectedBetBonus + bet.profit).toFixed(2));
}
