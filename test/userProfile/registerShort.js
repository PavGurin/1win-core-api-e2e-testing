import { checkErrMsg } from '../../src/responseChecker';
import { checkRegShortInfo } from '../../src/expects/exUser';
import { register } from '../../src/methods/register';

describe('Registration', () => {
  const currency = 'RUB';

  describe('Short schema w/o currency', () => {
    // register via short scheme with 'visit_domain' and 'PartnerKey'
    it('C19301 (+) with visit_domain with PartnerKey', async () => {
      const { data } = await register.oneClickReg({
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, currency);
    });

    it('C19302 (+) with visit domain w/o PartnerKey', async () => {
      const { data } = await register.oneClickReg({
        visit_domain: 'someDomain',
      });
      // console.log(data);
      checkRegShortInfo(data, currency);
    });

    it('C19303 (+) w/o visit_domain with PartnerKey', async () => {
      const { data } = await register.oneClickReg({
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, currency);
    });

    it('C19304 (-) w/o visit_domain w/o PartnerKey', async () => {
      // request without mandatory params
      const { data } = await register.oneClickReg({
        partner_key: undefined,
        visit_domain: undefined,
      });
      // console.log(data);
      checkErrMsg(data, 400, 'Visit domain is required if partner key does not specified');
    });
  });

  describe('Register - Short schema with currency', () => {
    it('C27393 - (+) with visit_domain with PartnerKey + RUB', async () => {
      const { data } = await register.oneClickReg({
        currency: 'RUB',
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, 'RUB');
    });

    it('C27394 - (+) with visit_domain with PartnerKey + EUR', async () => {
      const { data } = await register.oneClickRegEUR({
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, 'EUR');
    });

    it('C27410 - (+) with visit_domain with PartnerKey + USD', async () => {
      const { data } = await register.oneClickRegUSD({
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, 'USD');
    });

    it('C27411 - (+) with visit_domain with PartnerKey + currency = null', async () => {
      const { data } = await register.oneClickReg({
        currency: null,
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, 'RUB');
    });

    it('C27412 - (+) with visit_domain with PartnerKey + currency = not exist', async () => {
      const { data } = await register.oneClickReg({
        currency: 'RUL',
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkErrMsg(data, 400, 'currency is invalid');
    });

    it('C27428 - (+) with visit_domain with PartnerKey + currency = number ', async () => {
      const { data } = await register.oneClickReg({
        currency: 123,
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, currency should have a type of string, but found number');
    });

    it('C27429 (+) with visit_domain with PartnerKey + currency = undefined', async () => {
      const { data } = await register.oneClickReg({
        currency: undefined,
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkRegShortInfo(data, 'RUB');
    });


    it('C27430 (+) with visit_domain with PartnerKey + currency = empty', async () => {
      const { data } = await register.oneClickReg({
        currency: '',
        visit_domain: 'someDomain',
        partner_key: defaultPartnerKey,
      });
      // console.log(data);
      checkErrMsg(data, 400, 'currency is invalid');
    });
  });
});
