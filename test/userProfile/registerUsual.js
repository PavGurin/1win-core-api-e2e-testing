/* eslint camelcase: 'off' */
import { randomNum, randomStr } from '../../src/randomizer';
import { checkErrMsg } from '../../src/responseChecker';
import { checkRegInfo } from '../../src/expects/exUser';
import { register } from '../../src/methods/register';

describe('Register - Usual schema', () => {
  // (+) for positive tests (-) for negative tests
  it('C19305 (+) + visit_domain + PartnerKey', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await register.usualReg({
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain: defaultVisitDomain,
      partner_key: defaultPartnerKey,
    });

    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'RUB');
  });

  it('C19306 (+) + visit_domain - PartnerKey', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      visit_domain: defaultVisitDomain,
      currency: 'EUR',
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'EUR');
  });

  it('C19307 (+) - visit_domain + PartnerKey', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
      currency: 'USD',
    });
    // console.log(data);
    checkRegInfo(data, testStr, testNum, 'USD');
  });

  it('C19308 (-) - visit_domain - PartnerKey', async () => {
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: randomStr(),
      email: `${randomStr()}test@xyz.com`,
      phone: `922${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: undefined,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Visit domain is required if partner key does not specified');
  });

  it('C19309 (-) short name', async () => {
    const testStr = randomStr(2);
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Name is invalid, it\'s length must be from 3 to 16 symbols');
  });

  it('C19310 (-) long name', async () => {
    const testStr = randomStr(17);
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Name is invalid, it\'s length must be from 3 to 16 symbols');
  });

  it('C19311 (-) short phone number', async () => {
    const testStr = randomStr();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: randomStr(4),
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
  });

  it('C19312 (-) long phone number', async () => {
    const testStr = randomStr();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: randomStr(31),
      password: defaultPassword,
      repeat_password: defaultPassword,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Phone is invalid, it\'s length must be from 5 to 30 symbols');
  });

  it('C19313 (-) different passwords', async () => {
    const testStr = randomStr();
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: testStr,
      repeat_password: `${testStr}1`,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Password confirmation not matches to password');
  });

  it('C19314 (-) short password', async () => {
    const testStr = randomStr(5);
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: testStr,
      email: `${testStr}_test@xyz.com`,
      phone: `921${testNum}`,
      password: testStr,
      repeat_password: testStr,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Password is invalid, it\'s length must be from 6 to 18 symbols');
  });

  it('C19315 (-) long password', async () => {
    const testStr = randomStr(19);
    const testNum = randomNum();

    const { data } = await register.usualReg({
      isShort: false,
      name: randomStr(),
      email: `${randomStr()}_test@xyz.com`,
      phone: `921${testNum}`,
      password: testStr,
      repeat_password: testStr,
      partner_key: defaultPartnerKey,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Password is invalid, it\'s length must be from 6 to 18 symbols');
  });
});
