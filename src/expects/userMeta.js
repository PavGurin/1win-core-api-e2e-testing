/* eslint camelcase: 'off' */
import { expect } from 'chai';

export function checkUserMeta(data, withdrawal_block, user_demo_withdrawal,
  withdrawal_manual_control, tester, bonus_amount, games, full_block, rules_accepted,
  ignore_mts, test_val, email_editable, password_need_to_be_changed, user_risk_coefficient) {
  expect(data.withdrawal_block).equal(withdrawal_block);
  expect(data.user_demo_withdrawal).equal(user_demo_withdrawal);
  expect(data.withdrawal_manual_control).equal(withdrawal_manual_control);
  expect(data['1win_tester']).equal(tester);
  expect(data.bonus_amount).equal(bonus_amount);
  expect(data.games.initial).equal(games);
  expect(data.full_block.initial).equal(full_block);
  expect(data.rules_accepted).equal(rules_accepted);
  expect(data.ignore_mts).equal(ignore_mts);
  expect(data.test_val).equal(test_val);
  expect(data.email_editable).equal(email_editable);
  expect(data.password_need_to_be_changed).equal(password_need_to_be_changed);
  expect(data.user_risk_coefficient).equal(user_risk_coefficient);
}
