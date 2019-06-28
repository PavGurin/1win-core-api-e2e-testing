
import { expect } from 'chai';
import { userList } from '../../src/methods/userList';


describe('Get data about user from user.meta', () => {
  it('all expects', async () => {
    userList.login_with_RUB_USD();
    const meta = await socket.userMeta;
    console.log(meta);

    expect(meta.withdrawal_block).equal(false);
    expect(meta.user_demo_withdrawal).equal(false);
    expect(meta.withdrawal_manual_control).equal(false);
    expect(meta['1win_tester']).equal(false);
    expect(meta.bonus_amount).equal(0);
    expect(meta.games.initial).equal(true);
    expect(meta.full_block.initial).equal(false);
    expect(meta.rules_accepted).equal(true);
    expect(meta.ignore_mts).equal(false);
    expect(meta.test_val).equal(true);
    expect(meta.email_editable).equal(false);
    expect(meta.password_need_to_be_changed).equal(false);
    expect(meta.user_risk_coefficient).equal(1);
  });
});
