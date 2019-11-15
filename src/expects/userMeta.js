/* eslint camelcase: 'off' */

// Метод был заменен на toMatchSnapshot
const DEFAULT_USER_META = {
  withdrawal_block: false,
  user_demo_withdrawal: false,
  withdrawal_manual_control: false,
  '1win_tester': false,
  bonus_amount: 0,
  full_block: { initial: false },
  games: { initial: true },
  rules_accepted: true,
  ignore_mts: false,
  test_val: true,
  email_editable: true,
  password_need_to_be_changed: false,
  user_risk_coefficient: 1,
  is_vip_domain: false,
  verification_status: 0,
};

export const checkMeta = (meta, fields) => {
  const expected = {
    ...DEFAULT_USER_META,
    ...fields,
  };
  expect(Object.keys(meta).length).toEqual(Object.keys(expected).length);
  Object.keys(meta).forEach((key) => {
    expect(meta[key]).toEqual(expected[key]);
  });
};
